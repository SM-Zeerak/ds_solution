// const bcryptjs = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Vendor = require('../../models/Vendor/vendorModel');

// // Utility function to check profile completeness
// const isProfileComplete = (vendor) => {
//   const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage', 'cnicImage'];
//   return requiredFields.every((field) => vendor[field] && vendor[field].trim() !== '');
// };

// exports.loginVendor = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the vendor by email
//     const vendor = await vendor.findOne({ email });
//     if (!vendor) {
//       return res.status(404).json({ message: 'vendor not found' });
//     }

//     // Compare passwords
//     const isPasswordValid = await bcryptjs.compare(password, vendor.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Check if the profile is complete
//     const completedProfile = isProfileComplete(vendor);

//     // Generate a JWT token
//     const token = jwt.sign(
//       { vendorId: vendor._id, email: vendor.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     // Return the full vendor data along with the token and profile completeness status
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       vendor: {
//         _id: vendor._id,
//         firstName: vendor.firstName,
//         lastName: vendor.lastName,
//         email: vendor.email,
//         phone: vendor.phone,
//         cnic: vendor.cnic,
//         adress: vendor.adress,
//         aow: vendor.aow,
//         profileImage: vendor.profileImage,
//         cnicImage: vendor.cnicImage,
//         vendorId: vendor.vendorId,
//         teamId: vendor.teamId,
//         completedProfile // Whether the profile is complete or not
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };


const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../../models/Vendor/vendorModel'); // Use capital 'V' for model import

// Utility function to check profile completeness
const isProfileComplete = (vendor) => {
  const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage', 'cnicImage'];
  return requiredFields.every((field) => vendor[field] && vendor[field].trim() !== '');
};

exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the vendor by email
    const foundVendor = await Vendor.findOne({ email }); // Rename to 'foundVendor'
    if (!foundVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, foundVendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the profile is complete
    const completedProfile = isProfileComplete(foundVendor);

    // Generate a JWT token
    const token = jwt.sign(
      { vendorId: foundVendor._id, email: foundVendor.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the full vendor data along with the token and profile completeness status
    res.status(200).json({
      message: 'Login successful',
      token,
      vendor: {
        _id: foundVendor._id,
        firstName: foundVendor.firstName,
        lastName: foundVendor.lastName,
        email: foundVendor.email,
        phone: foundVendor.phone,
        cnic: foundVendor.cnic,
        adress: foundVendor.adress,
        aow: foundVendor.aow,
        profileImage: foundVendor.profileImage,
        cnicImage: foundVendor.cnicImage,
        vendorId: foundVendor.vendorId,
        teamId: foundVendor.teamId,
        completedProfile // Whether the profile is complete or not
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
