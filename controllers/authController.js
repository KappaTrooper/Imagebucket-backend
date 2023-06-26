const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// Function to handle user signup
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Function to handle user login
exports.login = async (req, res) => {
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

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get user info route
exports.getUserInfo = async (req, res) => {
  try {
    // Get the JWT token from the request headers
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the "Authorization" header

    // Decode the JWT token to extract the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Fetch the user information from the database based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the relevant user information you want to include in the response
    const userInfo = {
      username: user.username,
      // Include any other user information you need
    };

    res.json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Function to extract user ID from authentication logic
const getUserIdFromAuthLogic = (req) => {
  // Implement your authentication logic to extract the user ID from the request
  // For example, if the user ID is stored in the JWT token:
  const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the "Authorization" header
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.userId;
  return userId;
};

module.exports = {
  signup: exports.signup,
  login: exports.login,
  getUserInfo: exports.getUserInfo,
  getUserIdFromAuthLogic: getUserIdFromAuthLogic,
};
