// controllers/vendorController.js
const vendor = require('../../../models/Vendor/Auth/vendorRegisterModel');

// Create a new vendor
exports.createvendor = async (req, res) => {
  try {
    const { name, email, password , phone , address } = req.body;

    const vendor = new vendor({ name, email, password , phone , address });
    await vendor.save();
    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all vendors
exports.getAllvendors = async (req, res) => {
  try {
    const vendors = await vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
