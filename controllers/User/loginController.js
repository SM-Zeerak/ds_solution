const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User/userModel');
const { watch } = require('../../models/Orders/orderModel');

// Utility function to check profile completeness
const isProfileComplete = (user) => {
  const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage'];
  return requiredFields.every((field) => user[field] && user[field].trim() !== '');
};

exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the team by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);
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

    // Return the full team data along with the token and profile completeness status
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
        profileImage: user.profileImage,
        walletId: user.walletId,
        completedProfile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
