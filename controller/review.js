const Review = require("../models/review.js");
const Listing = require("../models/listing.js")

module.exports.createReview=(async (req, res) => {
    console.log("Listing ID from params:", req.params.id); // will now work
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
     listing.reviews.push(newReview);
  
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
   
    
    await newReview.save();
    await listing.save();
   req.flash("success","New review added")
    res.redirect(`/listings/${req.params.id}`);
});


// delete review
module.exports.destroyReview = async (req, res) => {
 let { id, reviewId } = req.params;
 await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};
