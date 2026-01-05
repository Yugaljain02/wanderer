
const mongoose = require("mongoose");
console.log(">>> Listing model loaded from:", __filename);

const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  location: String,
  country: String,
geometry: {
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  }
},



   category: {
    type: String,
    required: true,
  },
  image: {
   
      url: String, 
     filename : String,
    
  },
  reviews:[
    {
      type : Schema.Types.ObjectId,
      ref : "Review",
    },
  ],
  owner :{
    type: Schema.Types.ObjectId,
    ref: "User",
    required : true,
  
},
   
});
listingSchema.post("findAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

