const { Router } = require('express');
const uploadMiddleware = require('../middlewares/MulterMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const UploadModel = require('../models/UploadModel');
const User = require('../models/User');
const path = require('path');


const router = Router();

router.get('/', (req, res) => {
  res.send('Hello from Upload route');
});

router.get('/get', async (req, res) => {
  try {
    const allPhotos = await UploadModel.find()
      .sort({ createdAt: 'descending' })
      .select('photo title description takenBy')
      .populate('takenBy', 'username'); // Populate the 'takenBy' field with the 'username' field from the 'User' model

    res.send(allPhotos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/userImage', authMiddleware, async (req, res) => {
  try {
    const { username } = req.user; // Retrieve the username from the authenticated user

    const user = await User.findOne({ username }); // Find the user by the username

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user._id; // Retrieve the user ID
    const userImages = await UploadModel.find({ userID: userId })
      .sort({ createdAt: 'descending' })
      .select('photo title description takenBy');

    // Add the server URL prefix to each image path
    const imagesWithFilePath = userImages.map((image) => {
      return {
        ...image._doc,
        photo: `http://localhost:9001/uploads/${image.photo}`, // Replace with your server URL
      };
    });

    res.send(imagesWithFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const photo = await UploadModel.findById(id).select('photo title description takenBy likes impressions');

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.send({ photo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.patch('/:id/increase-likes', async (req, res) => {
  try {
    const { id } = req.params;

    const photo = await UploadModel.findById(id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Increase the likes for the photo
    photo.likes += 1;

    // Save the updated photo
    const updatedPhoto = await photo.save();

    res.send(updatedPhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// impressions route:

router.patch('/:id/increase-impressions', async (req, res) => {
  try {
    const { id } = req.params;

    const photo = await UploadModel.findById(id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Increase the impressions for the photo
    photo.impressions += 1;

    // Save the updated photo
    const updatedPhoto = await photo.save();

    res.send(updatedPhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



router.post('/', uploadMiddleware.single('photo'), async (req, res) => {
  try {
    const { file, body } = req;
    const usernames = req.usernames; // Retrieve usernames from the request object

    console.log('File:', file);
    console.log('Req File:', req.file);
    const { title, description, takenBy } = body;

    const photo = file.filename;
    const username = takenBy; // Update the username field to store the username
    const user = await User.findOne({ username }); // Find the user by the username

    const userID = user ? user._id.toString() : 'Unknown'; // Update to store the ID of the user

    const newUpload = new UploadModel({
      photo,
      title,
      description,
      takenBy: username,
      userID,
    });

    const savedUpload = await newUpload.save();
    console.log('Uploaded Successfully...');
    console.log(savedUpload);
    res.send(savedUpload);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
