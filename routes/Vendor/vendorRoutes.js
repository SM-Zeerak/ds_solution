const express = require('express');
const { createvendor, getAllvendors} = require('../../controllers/Vendor/vendorController');
const { updateProfile } = require('../../controllers/Vendor/updateVendorController');
const upload = require('../../services/Vendor/upload');
const { loginVendor } = require('../../controllers/Vendor/loginController');
const vendor = require('../../models/Vendor/vendorModel');

const router = express.Router();

router.post('/vendorsRegister', createvendor);
router.get('/vendor', getAllvendors);
router.get('/getVendors/:teamId', async (req, res) => {
    try {
      const { teamId } = req.params; // Get teamId from the route parameters
  
      // Fetch vendors based on the teamId
      const vendors = await vendor.find({ teamId: teamId });
  
      // If vendors are found, return them, otherwise return a message
      if (vendors.length > 0) {
        res.json(vendors);
      } else {
        res.status(404).json({ message: `No vendors found for teamId ${teamId}` });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// router.put(
//     '/profileUpdate/:id',
//     upload.fields([
//         { name: 'profileImage', maxCount: 1 },
//         { name: 'cnicImage', maxCount: 1 }
//     ]),
//     updateProfile
// );

router.put(
  '/profileUpdate/:id',
  fileUpload, // Use fileUpload middleware here
  updateProfile
);
router.post('/vendorsLogin', loginVendor);


module.exports = router;
