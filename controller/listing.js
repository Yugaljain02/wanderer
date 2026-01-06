const Listing = require("../models/listing");
const axios = require("axios");


// index
// index (with filter support)
module.exports.index = async (req, res) => {
    const { category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({ category :  category.toLowerCase() });
    } else {
        allListings = await Listing.find({});
    }
      console.log(allListings);
    res.render("listing/index.ejs", { allListings });
};

// new
module.exports.renderNewForm = (req,res)=>{
    res.render("listing/new.ejs");
};

//show
module.exports.showListing=(async(req,res)=>{
    let {id} =req.params;
const listing = await Listing.findById(id).populate({path: "reviews",
       populate : {
        path : "author",
       },
})
.populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
   return res.redirect("/listings");
  }
  console.log(listing);

   res.render("listing/show.ejs",{listing});
});
module.exports.createlisting = async (req, res) => {
  const { location } = req.body.listing;

  // 🌍 FREE geocoding using OpenStreetMap (Nominatim)
  const geoResponse = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
    }
  );

  if (geoResponse.data.length === 0) {
    req.flash("error", "Location not found");
    return res.redirect("/listings/new");
  }

  const lat = geoResponse.data[0].lat;
  const lng = geoResponse.data[0].lon;

  const newListing = new Listing(req.body.listing);

  // 🔥 SAVE GEOMETRY (REQUIRED BY SCHEMA)
  newListing.geometry = {
    type: "Point",
    coordinates: [lng, lat], // [longitude, latitude]
  };

  // image (multer + cloudinary)
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = (async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");


     if(!listing){
    req.flash("error","Listing you requested for does not exist!");
   return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
   originalImageUrl.replace("/upload","upload/h_300,w_250")
   res.render("listing/edit.ejs",{listing});
});
//put
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const newLocation = req.body.listing.location;

  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const oldLocation = listing.location; // ✅ save old value

  // 📝 update normal fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.country = req.body.listing.country;
  listing.category = req.body.listing.category;
  listing.location = newLocation;

  // 🌍 re-geocode ONLY if location changed
  if (newLocation && newLocation !== oldLocation) {
    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: newLocation,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "WanderlyApp/1.0 (learning-project)",
        },
      }
    );

    if (geoResponse.data.length === 0) {
      req.flash("error", "Invalid location");
      return res.redirect(`/listings/${id}/edit`);
    }

    const lat = parseFloat(geoResponse.data[0].lat);
    const lng = parseFloat(geoResponse.data[0].lon);

    // ✅ REQUIRED GeoJSON
    listing.geometry = {
      type: "Point",
      coordinates: [lng, lat],
    };
  }

  // 🖼️ update image if new uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};
//seaech 
module.exports.searchListings = async (req, res) => {
  const q = req.query.q?.trim();
  console.log("you query",1);
  if (!q) {
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
       { category: { $regex: q, $options: "i" } },
    ],
  });

  if (listings.length === 0) {
    req.flash("error", "No listings found");
    return res.redirect("/listings");
  }

  res.render("listing/index.ejs", { allListings: listings });
};
