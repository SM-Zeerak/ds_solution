const User = require('../../models/User/userModel'); // Renamed the model variable
const path = require('path');

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { cnic, firstName, lastName, phone, adress } = req.body;

        const updates = {};

        if (cnic) updates.cnic = cnic;
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (phone) updates.phone = phone;
        if (adress) updates.adress = adress;

        // Sanitize CNIC to remove any non-numeric characters (e.g., dashes)
        const sanitizedCnic = cnic ? cnic.replace(/\D/g, '') : null;

        if (req.files) {
            const profileImageFile = req.files.find(f => f.fieldname === 'profileImage');

            if (profileImageFile) updates.profileImage = profileImageFile.path;
        }

      
      
        if (firstName && lastName && sanitizedCnic && sanitizedCnic.length >= 4) {
            const firstLetter = firstName[0].toUpperCase();
            const lastLetter = lastName[0].toUpperCase();
            const lastFourCnic = sanitizedCnic.slice(-4); // Get last 4 digits of CNIC
            const userId = `${firstLetter}${lastLetter}${lastFourCnic}`;
            updates.userId = userId;
        }

        
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
