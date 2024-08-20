const User = require("../models/user.js");

module.exports.US1 = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
          console.log(registeredUser)
        req.flash("success", "Welcome to WonderfulLand!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    next();
};

module.exports.US2 = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
    next()
};
