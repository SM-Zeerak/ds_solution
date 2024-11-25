const express = require('express');
const { createTeam, getAllTeams } = require('../../controllers/team/teamController');
const { updateProfile } = require('../../controllers/team/updateTeamController'); 
const upload = require('../../services/team/upload');
const { loginteam } = require('../../controllers/team/loginController');

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
