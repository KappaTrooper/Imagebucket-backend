const {Router} = require('express'); // import Router object from express
const uploadMiddleware = require('../middlewares/MulterMiddleware');


const router = Router(); // create a router object


router.post('/api/save', uploadMiddleware.single("photo"),  (req, res) => { // handle post requests to /api/save
    const photo = req.file.filename; // get file name from multer middleware
    
    console.log(photo);
});

module.exports = router; // export the router object