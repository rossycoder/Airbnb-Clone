const list = require("./models/listing.js")
const Reviews = require("./models/reviews.js");
const{listschema,reviewSchema}=require("./schema.js")
const ExpressError = require("./utils/ExpressError.js");
require('dotenv').config();


// Ensure correct import
module.exports.isLoggedIn = (req, res, next) => {
    console.log('Is Authenticated:', req.isAuthenticated());
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    try {
        let listing = await list.findById(id);
        if (!listing || !listing.owner._id.equals(req.user._id)) {
            req.flash("error", "You don't have permission to update this listing.");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
};






module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    try {
        let review = await Reviews.findById(reviewid); // Corrected variable name and ID lookup
        if (!review || !review.author._id.equals(req.user._id)) {
            req.flash("error", "You are not the author of this review.");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        console.log(err);

}}
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
 if (error) {
        let errormsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errormsg);
    } else {
        next();
    }
};
module.exports.validateList = (req, res, next) => {
     // Debug to see what data is being sent

    let { error } = listschema.validate(req.body.list);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};
