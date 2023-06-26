const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); // Correct the path to your User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





// Signup route
router.post('/signup', authController.signup);

// // Login route
// router.post('/login', (req, res, next) => {
//   authController.login(req, res, (err, user) => {
//     if (err) {
//       return res.status(401).json({ message: err.message });
//     }

//     const { username } = user;
//     res.json({ token: user.accessToken, username });
//   });
// });

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the entered password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    // Retrieve additional user information
    const userInfo = {
      username: user.username,
      // Include any other user information you need
    };

    res.status(200).json({ token, userInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// User info route
router.get('/userinfo', authController.getUserInfo);

module.exports = router;
