
// controllers/userController.js
const User = require('../models/userModel');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const {email, password , phone} = req.body;

    const user = new User({email, password , phone});
    await user.save();
    res.status(201).json({ message: 'Vendor created successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



