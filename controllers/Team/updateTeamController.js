const Team = require('../../models/Team/teamModel'); // Renamed the model variable
const path = require('path');

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { cnic, firstName, lastName, phone, adress, aow } = req.body;

        const updates = {};

        if (cnic) updates.cnic = cnic;
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (phone) updates.phone = phone;
        if (adress) updates.adress = adress;
        if (aow) updates.aow = aow;

        // Sanitize CNIC to remove any non-numeric characters (e.g., dashes)
        const sanitizedCnic = cnic ? cnic.replace(/\D/g, '') : null;

        if (req.files) {
            const profileImageFile = req.files.find(f => f.fieldname === 'profileImage');
            const cnicImageFile = req.files.find(f => f.fieldname === 'cnicImage');

            if (profileImageFile) updates.profileImage = profileImageFile.path;
            if (cnicImageFile && sanitizedCnic) updates.cnicImage = cnicImageFile.path;
        }

      
        // Generate teamId if firstName, lastName, and cnic are present
        if (firstName && lastName && sanitizedCnic && sanitizedCnic.length >= 4) {
            const firstLetter = firstName[0].toUpperCase();
            const lastLetter = lastName[0].toUpperCase();
            const lastFourCnic = sanitizedCnic.slice(-4); // Get last 4 digits of CNIC
            const teamId = `${firstLetter}${lastLetter}${lastFourCnic}`;
            updates.teamId = teamId;
        }

        // Find the team by ID and update
        const updatedTeam = await Team.findByIdAndUpdate(id, updates, { new: true }); // Use updatedTeam to avoid conflict
        if (!updatedTeam) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', team: updatedTeam });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
