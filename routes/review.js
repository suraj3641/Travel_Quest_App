const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");//require utills fn.
const ExpressError=require("../utils/ExpressError.js");//require expresserror
const Review =require("../models/review.js");
const Listing =require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} =require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


//Reviews=
//Post reviews Route==

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


//delete reviews route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));



    module.exports=router;
