const Listing =require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
 res.render("listings/index.ejs",{allListings});
     
     };



     module.exports.renderNewForm = (req,res)=>{
        res.render("listings/new.ejs");
    };



  
    module.exports.showListing=  async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id)
        .populate({
         path:"reviews",
         populate:{
            path:"author",
         },
      }
    )
         .populate("owner");
        if(!listing){
           req.flash("error","Listing you requested for does not exits!");
           res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs",{listing});
    };



    module.exports.createListing= async(req,res,next)=>{
//     let response= await geocodingClient.forwardGeocode({
//          query: 'New Delhi, India',
//          limit: 2
//        })
//          .send();
//          console.log(response);
// res.send("done!");

      let url=req.file.url;
      let folder=req.file.folder;
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,folder};
        await newListing.save();
        req.flash("success","New Listing Created!");//from request, done massege flash
        res.redirect("/listings");
       };



       module.exports.renderEditForm=  async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
         req.flash("error","Listing you requested for does not exits!");
         res.redirect("/listings");
      }
      let originalImageUrl=listing.image.url;
      originalImageUrl =  originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing ,originalImageUrl});
     };




     module.exports.updateListing= async(req,res)=>{
        let {id}=req.params;
       let listing= await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
       
       if(typeof req.file !=="undefined"){ 
       let url=req.file.url;
       let folder=req.file.folder;
       listing.image={url,folder};
       await listing.save();
       }
        req.flash("success"," Listing Updated!");
        res.redirect(`/listings/${id}`);
     };



     module.exports.distroyListing= async(req,res)=>{
        let {id}=req.params;
       let deletedListing= await Listing.findByIdAndDelete(id);
       console.log(deletedListing);
       req.flash("success"," Listing Deleted!");
        res.redirect("/listings");
     };