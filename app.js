
if(process.env.NODE_ENV !="production"){ 
require('dotenv').config();
}

const express=require("express");   //require express
const app=express();
const mongoose=require("mongoose");  //require mongoose
const path=require("path");// require listing.js
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); ///require ejs mate
const ExpressError=require("./utils/ExpressError.js");//require expresserror
const session =require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User =require("./models/user.js");



const listingsRouter=require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");
const { date } = require("joi");

//connection of DB
const MONGO_URL="mongodb://127.0.0.1:27017/TravelQuest";

// const dbUrl= process.env.ATLASDB_URL;


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
};


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));




const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SECRETE,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in mongo SESSION STORE",err);
});

//add session==
const sessionOptions={
    store,
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};


// //create basic api
// app.get("/",(req,res)=>{
//     res.send("Hii,I am root");
// });




//use session==
app.use(session(sessionOptions));
//use flash==
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for flash middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



app.use("/listings",listingsRouter);//use of single line for listings.js 
app.use("/listings/:id/reviews",reviewsRouter);//use of single line for reviews.js
app.use("/" ,userRouter);


//error handling middleware 
app.all("*" ,(req,res,next)=>{ // *, first match  above route, if above route  does not match then it will  execute  
    next(new ExpressError(404,"Page Not Found!"));
});

//middleware create==
app.use((err,req,res,next)=>{
    let {statusCode=500,message="SOMETHING WENT WRONG!"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});



// server start 
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});