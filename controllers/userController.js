// // controllers/userController.js
// const User = require('../models/userModel');

// // Create a new user
// exports.createUser = async (req, res) => {
//   try {
//     const { name, email, password , phone , address } = req.body;

//     const user = new User({ name, email, password , phone , address });
//     await user.save();
//     res.status(201).json({ message: 'Vendor created successfully', user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all users
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// controllers/userController.js
const User = require('../models/userModel');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    let profileImage = '';

    // Check if there's a file attached (assuming you're uploading via multipart/form-data)
    if (req.file) {
      profileImage = req.file.path; // Store the local file path or URL
    }

    const user = new User({ name, email, password, phone, address, profileImage });
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
