const express = require('express');
const { createTeam, getAllTeams } = require('../../controllers/Team/teamController');
const { updateProfile } = require('../../controllers/Team/updateTeamController'); 
const upload = require('../../services/Team/upload');
const { loginteam } = require('../../controllers/Team/loginController');

const router = express.Router();

router.post('/teamsRegister', createTeam); // Create a new team
router.get('/teams', getAllTeams);
router.put(
    '/teamProfileUpdate/:id',
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'cnicImage', maxCount: 1 }
    ]),
    updateProfile
);
router.post('/teamsLogin', loginteam);

module.exports = router;
