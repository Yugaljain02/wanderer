const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require ("../models/listing");
const Mongo_Url = "mongodb://127.0.0.1:27017/test"
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(Mongo_Url);
}
const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
    ...obj,
    owner: new mongoose.Types.ObjectId("694c2df4fbd0c6eb47cb8dd3"),
    }));
    await Listing.insertMany(initData.data);
console.log("data was initialised");
};
initDB();