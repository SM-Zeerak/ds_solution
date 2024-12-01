const mongoose = require('mongoose');  // Import mongoose
const vendor = require('../../models/Vendor/vendorModel');
const Category = require('../../models/Category/categoryModel');
const path = require('path');

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { cnic, firstName, lastName, phone, teamId, adress, aow, profession } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid vendor ID' });
        }

        // Fetch the existing vendor to get the current profession
        const existingVendor = await vendor.findById(id);
        if (!existingVendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const previousProfession = existingVendor.profession || [];

        const updates = {};
        if (cnic) updates.cnic = cnic;
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (phone) updates.phone = phone;
        if (adress) updates.adress = adress;
        if (aow) updates.aow = aow;
        updates.teamId = teamId || 'DZVendors';

        const sanitizedCnic = cnic ? cnic.replace(/\D/g, '') : null;

        if (req.files?.profileImage) {
            const profileImagePath = `/uploads/${phone}/profileImg/${req.files.profileImage[0].filename}`;
            updates.profileImage = profileImagePath;
        }

        if (req.files?.cnicImage && sanitizedCnic) {
            const cnicImagePath = `/uploads/${phone}/cnicImg/${sanitizedCnic}/${req.files.cnicImage[0].filename}`;
            updates.cnicImage = cnicImagePath;
        }

        if (firstName && lastName && sanitizedCnic && sanitizedCnic.length >= 4) {
            const vendorId = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}${sanitizedCnic.slice(-4)}`;
            updates.vendorId = vendorId;
        }

        // Decrement vendorCount for removed professions
        for (const prevSubCategory of previousProfession) {
            if (!profession.includes(prevSubCategory)) {
                const category = await Category.findOne({ subCategories: prevSubCategory });
                if (category && typeof category.vendorCount === 'number') {
                    category.vendorCount = Math.max(0, category.vendorCount - 1); // Ensure non-negative count
                    await category.save();
                }
            }
        }

        // Increment vendorCount for new professions
        for (const subCategory of profession) {
            const category = await Category.findOne({ subCategories: subCategory });
            if (category) {
                if (typeof category.vendorCount !== 'number') {
                    category.vendorCount = 0;
                }
                if (!previousProfession.includes(subCategory)) {
                    category.vendorCount += 1;
                }
                await category.save();
            }
        }

        updates.profession = profession;

        const updatedVendor = await vendor.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({ message: 'Profile updated successfully', vendor: updatedVendor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
