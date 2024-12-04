const mongoose = require('mongoose');
const Vendor = require('../../models/Vendor/vendorModel');
const Category = require('../../models/Category/categoryModel');

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { cnic, firstName, lastName, phone, teamId, adress, aow, profession } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid vendor ID' });
        }

        const existingVendor = await Vendor.findById(id);
        if (!existingVendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const previousProfession = existingVendor.profession || [];
        const updates = {
            cnic,
            firstName,
            lastName,
            phone,
            adress,
            aow,
            teamId: teamId || 'DZVendors',
        };

        const sanitizedCnic = cnic ? cnic.replace(/\D/g, '') : null;

        // Use uploaded file paths from multer
        if (req.files) {
            const profileImageFile = req.files.find(f => f.fieldname === 'profileImage');
            const cnicImageFile = req.files.find(f => f.fieldname === 'cnicImage');

            if (profileImageFile) updates.profileImage = profileImageFile.path;
            if (cnicImageFile && sanitizedCnic) updates.cnicImage = cnicImageFile.path;
        }

        if (firstName && lastName && sanitizedCnic && sanitizedCnic.length >= 4) {
            updates.vendorId = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}${sanitizedCnic.slice(-4)}`;
        }

        await updateProfessionCounts(profession, previousProfession);
        updates.profession = profession;

        const updatedVendor = await Vendor.findByIdAndUpdate(id, { $set: updates }, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', vendor: updatedVendor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateProfessionCounts = async (newProfessions = [], oldProfessions = []) => {
    const removedProfessions = oldProfessions.filter(p => !newProfessions.includes(p));
    const addedProfessions = newProfessions.filter(p => !oldProfessions.includes(p));

    for (const profession of removedProfessions) {
        const category = await Category.findOne({ subCategories: profession });
        if (category && typeof category.vendorCount === 'number') {
            category.vendorCount = Math.max(0, category.vendorCount - 1);
            await category.save();
        }
    }

    for (const profession of addedProfessions) {
        const category = await Category.findOne({ subCategories: profession });
        if (category) {
            category.vendorCount = (category.vendorCount || 0) + 1;
            await category.save();
        }
    }
};
