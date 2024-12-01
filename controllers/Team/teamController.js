const Team = require('../../models/Team/teamModel');
const bcryptjs = require('bcryptjs');

// Utility function to check profile completeness
const isProfileComplete = (team) => {
  const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage', 'cnicImage'];
  return requiredFields.every((field) => team[field] && team[field].trim() !== '');
};

// Create a team
exports.createTeam = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create the team with the hashed password
    const newTeam = new Team({ email, password: hashedPassword, phone });
    await newTeam.save();

    // Check profile completeness
    const completedProfile = isProfileComplete(newTeam);

    res.status(201).json({
      message: 'Team created successfully',
      team: newTeam,
      completedProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
