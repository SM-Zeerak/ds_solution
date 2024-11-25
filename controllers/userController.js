const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

// Utility function to check profile completeness
const isProfileComplete = (user) => {
  const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage', 'cnicImage'];
  return requiredFields.every((field) => user[field] && user[field].trim() !== '');
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create the user with the hashed password
    const user = new User({ email, password: hashedPassword, phone });
    await user.save();

    // Check profile completeness
    const completedProfile = isProfileComplete(user);

    res.status(201).json({
      message: 'Vendor created successfully',
      user,
      completedProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
  // Get all users
  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


