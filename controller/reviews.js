const Reviews = require("../models/reviews.js");
const list = require("../models/listing.js");

module.exports.revew1 = async (req, res, next) => {
    
        let listing = await list.findById(req.params.id);
        let newReview = new Reviews(req.body.review);
        newReview.author = req.user._id; // Assuming user is authenticated and `req.user` contains user info
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    
};

module.exports.revew2 = async (req, res, next) => {
  
        let { id, reviewid } = req.params;
        await list.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
        await Reviews.findByIdAndDelete(reviewid);
        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
    
};
