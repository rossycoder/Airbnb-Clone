const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const Reviews = require("../models/reviews.js");
const list = require("../models/listing.js");
const reviewcontroller = require("../controller/reviews.js");

// Reviews Create
router.post("/", isLoggedIn,wrapAsync(reviewcontroller.revew1));

// Delete Review
router.delete("/:reviewid",  isLoggedIn,isAuthor, wrapAsync(reviewcontroller.revew2));

module.exports = router;

