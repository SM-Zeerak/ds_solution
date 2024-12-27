const express = require('express');
const { createUser, getAllUsers } = require('../../controllers/User/userController');
const { updateProfile } = require('../../controllers/User/updateuserController');
const fileUpload = require('../../services/User/upload');
const { loginuser } = require('../../controllers/User/loginController');

const router = express.Router();

router.post('/usersRegister', createUser); // Create a new team
router.get('/users', getAllUsers);
// router.put(
//     '/teamProfileUpdate/:id',
//     upload.fields([
//         { name: 'profileImage', maxCount: 1 },
//         { name: 'cnicImage', maxCount: 1 }
//     ]),
//     updateProfile
// );

router.put(
    '/userProfileUpdate/:id',
    fileUpload,
    updateProfile
  );
router.post('/usersLogin', loginuser);

module.exports = router;
