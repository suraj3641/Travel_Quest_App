
const { string, required } = require("joi");
const mongoose=require("mongoose");  //require mongoose
const Schema=mongoose.Schema;// Schema var. //instead of mongoose.schema now written schema only
const Review=require("./review.js");


//create listingschema
const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },

    description:String,

    image:{
        url:String,
        folder:String,
    },
    price:Number,
    location:String,
    country:String,

    reviews:[
        {
    type:Schema.Types.ObjectId,
    ref:"Review",
    },
],

owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
},

geometry:{
    type:{
        type:String,
        enum:["Point"],
        required:true,
    },
    coordinates:{
        type:[Number],
        required:true
    },
},


// category:{
//     type:String,
//     enum:["Tranding",

//         "Rooms",
        
//         "Iconic Cities",
        
//         "Mountains",
        
//         "Castles",
        
//         "Amazing Pools",
        
//         "Camping",
        
//         "Farms",
        
//         "Arctic"],

// },

});


listingSchema.post("findOneAndDelete",async (listing)=>{
if(listing){ 
await Review.deleteMany({_id:{$in:listing.reviews}});
}
});



//using listingschema ,create the model
const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;