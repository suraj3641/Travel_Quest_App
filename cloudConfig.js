const cloudinary = require('cloudinary');
const  CloudinaryStorage  = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
api_key: process.env.CLOUD_API_KEY,
api_secret: process.env.CLOUD_API_SECRET,
});


const storage = CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png","jpg" ,"jpeg"], // supports promises as well
  
    },
  });


  module.exports={
    cloudinary,
    storage,
  
  };
   