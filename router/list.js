const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listController = require("../controller/listing.js");
const multer = require('multer');
const passport = require('passport');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
const { isLoggedIn, isOwner, validateList } = require("../middleware.js");

// Define the search route before the :id route
router.get("/search",wrapAsync(listController.searchListings));



// Define your routes here


router.get("/", wrapAsync(listController.index));
router.get("/new", isLoggedIn, (req, res) =>  res.render("list/new.ejs"));
router.get("/:id([0-9a-fA-F]{24})/edit", isLoggedIn, wrapAsync(listController.index4));
router.get("/:id([0-9a-fA-F]{24})", wrapAsync(listController.index2));
router.get("/filter",listController.filterByCategory);
router.post("/", isLoggedIn , upload.single('lists[image]'), validateList, wrapAsync(listController.index3));
router.put("/:id([0-9a-fA-F]{24})", isLoggedIn, upload.single('lists[image]'), validateList, isOwner, wrapAsync(listController.index5));
router.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, isOwner, wrapAsync(listController.index6));


module.exports = router;
