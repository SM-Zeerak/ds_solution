const vendor = require('../../models/Vendor/vendorModel');
const bcryptjs = require('bcryptjs');

// Utility function to check profile completeness
const isProfileComplete = (vendor) => {
  const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage', 'cnicImage'];
  return requiredFields.every((field) => vendor[field] && vendor[field].trim() !== '');
};

exports.createvendor = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create the vendor with the hashed password
    const vendor = new vendor({ email, password: hashedPassword, phone });
    await vendor.save();

    // Check profile completeness
    const completedProfile = isProfileComplete(vendor);

    res.status(201).json({
      message: 'Vendor created successfully',
      vendor,
      completedProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
  // Get all vendors
  exports.getAllvendors = async (req, res) => {
    try {
      const vendors = await vendor.find();
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


