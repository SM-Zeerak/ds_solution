const express = require('express');
const { createvendor, getAllvendors} = require('../../controllers/Vendor/vendorController');
const { updateProfile } = require('../../controllers/Vendor/updateVendorController');
const upload = require('../../services/Vendor/upload');
const { loginVendor } = require('../../controllers/Vendor/loginController');

const router = express.Router();

router.post('/vendorsRegister', createvendor); // Create a new vendor
router.get('/vendors', getAllvendors);
router.put(
    '/profileUpdate/:id',
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'cnicImage', maxCount: 1 }
    ]),
    updateProfile
);
router.post('/vendorsLogin', loginVendor);


module.exports = router;
