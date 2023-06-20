// Desc: Multer middleware for file upload
// Note: This middleware is used in Server/Routes/Upload.js


const multer = require('multer'); 

const {v4: uuidv4} = require('uuid');

const path = require('path'); // import path module (build in)

const storage = multer.diskStorage({
    destination: function(req, file, cb) { // cb is callback function 
        cb(null, './public/uploads'); // set destination folder
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); // set file name
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png']; // allowed file types for upload
    if (allowedFileTypes.includes(file.mimetype)) { // check if file type is allowed
        cb(null, true); // if allowed, pass true to callback
    } else {
        cb(null, false); // else pass false
    }
};

const uploadMiddleware = multer({storage, fileFilter}); // create multer object

module.exports = uploadMiddleware; // export multer object