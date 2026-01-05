const express = require("express");    // import express
const router = express.Router({ mergeParams: true });    // create router correctly
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isvalidateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");



// POST review route
router.post("/",isLoggedIn,isvalidateReview, wrapAsync(reviewController.createReview));

// delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview) );

module.exports = router;