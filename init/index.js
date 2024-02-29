const mongoose=require("mongoose"); //require mongoose
const initData =require("./data.js");  //require  data.js
const Listing =require("../models/listing.js");// require listing.js

//connection of DB
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()//calling  DB
.then(()=>{
    console.log("connection to DB");
})
.catch((err)=>{
    console.log(err);
});
//async function for DB
async function main(){
    await mongoose.connect(MONGO_URL);
}


// create function
const initDB=async ()=>{
    await Listing.deleteMany({});
  initData.data=  initData.data.map((obj)=>({...obj, owner:"65daad803cb6741ca9600834"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB(); //call initDB function

