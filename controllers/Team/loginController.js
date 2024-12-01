const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Team = require('../../models/Team/teamModel');

// Utility function to check profile completeness
const isProfileComplete = (team) => {
  const requiredFields = ['firstName', 'lastName', 'cnic', 'adress', 'profileImage', 'cnicImage'];
  return requiredFields.every((field) => team[field] && team[field].trim() !== '');
};

exports.loginteam = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the team by email
    const team = await Team.findOne({ email });
    if (!team) {
      return res.status(404).json({ message: 'team not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, team.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the profile is complete
    const completedProfile = isProfileComplete(team);

    // Generate a JWT token
    const token = jwt.sign(
      { teamId: team._id, email: team.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the full team data along with the token and profile completeness status
    res.status(200).json({
      message: 'Login successful',
      token,
      team: {
        _id: team._id,
        firstName: team.firstName,
        lastName: team.lastName,
        email: team.email,
        phone: team.phone,
        cnic: team.cnic,
        adress: team.adress,
        aow: team.aow,
        profileImage: team.profileImage,
        cnicImage: team.cnicImage,
        teamId: team.teamId,
        teamId: team.teamId,
        completedProfile // Whether the profile is complete or not
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
