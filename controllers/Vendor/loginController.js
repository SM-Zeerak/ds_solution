// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const User = require('.././../models/userModel');

// exports.loginVendor = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Compare passwords
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate a JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET, // Ensure this is set
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: { _id: user._id, email: user.email }  // Avoid sending the password
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

// Utility function to check profile completeness
const isProfileComplete = (user) => {
  const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage', 'cnicImage'];
  return requiredFields.every((field) => user[field] && user[field].trim() !== '');
};

exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the profile is complete
    const completedProfile = isProfileComplete(user);

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the full user data along with the token and profile completeness status
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        cnic: user.cnic,
        adress: user.adress,
        aow: user.aow,
        profileImage: user.profileImage,
        cnicImage: user.cnicImage,
        vendorId: user.vendorId,
        teamId: user.teamId,
        completedProfile // Whether the profile is complete or not
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
