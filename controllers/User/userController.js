const User = require('../../models/User/userModel');
const Wallet = require('../../models/Wallet/walletModel'); 
const bcryptjs = require('bcryptjs');

// Utility function to check profile completeness
const isProfileComplete = (user) => {
  const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage', 'cnicImage'];
  return requiredFields.every((field) => user[field] && user[field].trim() !== '');
};


// exports.createUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;


//     const hashedPassword = await bcryptjs.hash(password, 10);


//     const newUser = new User({ email, password: hashedPassword});
//     await newUser.save();

//     // Check profile completeness
//     const completedProfile = isProfileComplete(newUser);

//     res.status(201).json({
//       message: 'User created successfully',
//       user: newUser,
//       completedProfile
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create and save the user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Create a wallet for the user
    const wallet = new Wallet({
      userId: newUser._id.toString(), // Ensure `userId` is a string as per your schema
      userType: 'user', // Set userType appropriately
      cashBalance: 0, // Default balance
      onlineBalance: 0, // Default balance
      transactions: [], // Initialize with empty transactions
    });
    await wallet.save();

    // Add walletId to the user's document (optional, based on requirements)
    newUser.walletId = wallet._id;
    await newUser.save();

    res.status(201).json({
      message: 'User and wallet created successfully',
      user: newUser,
      wallet,
    });
  } catch (error) {
    console.error('Error creating user and wallet:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
