const User = require('../models/userModel');
const path = require('path');

exports.updateProfile = async (req, res) => {
  try {
      const { id } = req.params;
      const { cnic, firstName, lastName, phone, teamId , adress , aow } = req.body;

      if (!phone) {
          return res.status(400).json({ error: 'Phone number is required' });
      }

      const updates = {};

      if (cnic) updates.cnic = cnic;
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (phone) updates.phone = phone;
      if (adress) updates.adress = adress;
      if (aow) updates.aow = aow;

      // Set teamId to 'DZVendors' if not provided
      updates.teamId = teamId || 'DZVendors';

      // Sanitize CNIC to remove any non-numeric characters (e.g., dashes)
      const sanitizedCnic = cnic ? cnic.replace(/\D/g, '') : null;

      // Handle profile image upload
      if (req.files && req.files.profileImage) {
          const profileImagePath = `/uploads/${phone}/profileImg/${req.files.profileImage[0].filename}`;
          updates.profileImage = profileImagePath;
      }

      // Handle CNIC image upload
      if (req.files && req.files.cnicImage && sanitizedCnic) {
        const cnicImagePath = `/uploads/${phone}/cnicImg/${sanitizedCnic}/${req.files.cnicImage[0].filename}`;
        updates.cnicImage = cnicImagePath;
    }

      // Generate vendorId if firstName, lastName, and cnic are present
      if (firstName && lastName && sanitizedCnic && sanitizedCnic.length >= 4) {
          const firstLetter = firstName[0].toUpperCase();
          const lastLetter = lastName[0].toUpperCase();
          const lastFourCnic = sanitizedCnic.slice(-4); // Get last 4 digits of CNIC
          const vendorId = `${firstLetter}${lastLetter}${lastFourCnic}`;
          updates.vendorId = vendorId;
      }

      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
