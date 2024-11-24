const express = require('express');
const { createUser, getAllUsers} = require('../controllers/userController');
const { updateProfile } = require('../controllers/updateUserController');
const upload = require('../services/upload');

const router = express.Router();

router.post('/vendorsRegister', createUser); // Create a new user
router.get('/users', getAllUsers);
router.put(
    '/profileUpdate/:id',
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'cnicImage', maxCount: 1 }
    ]),
    updateProfile
);


module.exports = router;
