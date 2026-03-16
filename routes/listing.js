const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner}  = require("../middleware.js");
const {isvalidateListing}   = require("../middleware.js");
const listingcontroller = require("../controller/listing.js");
const multer = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});




// index route, post route
  router.route("/")
   .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,
   // isvalidateListing,
     upload.single('listing[image]'),
    wrapAsync(listingcontroller.createlisting)
  );


 //new route
router.get("/new", isLoggedIn,listingcontroller.renderNewForm);
// search
// SEARCH ROUTE
router.get("/search", wrapAsync(listingcontroller.searchListings));


// show route,put route,delete route
router.route("/:id")
  .get(wrapAsync(listingcontroller.showListing))
  .put(isLoggedIn,isOwner,isvalidateListing, upload.single('Listing[image]'),wrapAsync(listingcontroller.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.destroyListing));



//edit form 
router.get("/:id/edit",isLoggedIn,wrapAsync (listingcontroller.renderEditForm));







module.exports = router;    