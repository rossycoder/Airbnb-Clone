const express = require("express");
const router1 = express.Router();
const passport = require('passport');
const wrapAsync = require("../utils/wrapAsync");
const listController = require("../controller/US.js");
const { saveRedirectUrl } = require("../middleware.js");

// Sign up
router1.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});

router1.post("/signup", wrapAsync(listController.US1));

// Login
router1.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

router1.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.flash("success", "Welcome back to Wonderfulland.");
    const redirectUrl = req.session.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

// Google login route
router1.get('/auth/google', passport.authenticate('google', {
    scope: ['email']
}));

// Google callback route
router1.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true
}), async (req, res) => {
    req.flash('success', 'Successfully logged in with Google!');
    res.redirect('/listings');
});

// Logout
router1.get("/logout", listController.US2);

module.exports = router1;
