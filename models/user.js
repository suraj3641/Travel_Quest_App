
const { required } = require("joi");
const mongoose=require("mongoose");  //require mongoose
const Schema=mongoose.Schema;// Schema var. //instead of mongoose.schema now written schema only

const passportLocalMongoose=require("passport-local-mongoose");


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);