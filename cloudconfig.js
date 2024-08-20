const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET_KEY,
    
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wonderfull_land',
        allowedFormats: ['png', 'jpg', 'gif', 'jpeg', 'jfif']
    }
});

module.exports = { cloudinary, storage };

 // Cloudinary expects timestamp in seconds

 // Use environment variable for security

// Generate the signature using HMAC-SHA1



