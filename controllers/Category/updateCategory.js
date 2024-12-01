const Category = require('../../models/Category/categoryModel'); // Use the correct Category model

// exports.updateCategory = async (req, res) => {
//   try {
//     const { name, subCategories, collections } = req.body;
//     const categoryId = req.params.id;  // ID of the category to be updated

//     // Check if subCategories is provided
//     if (!subCategories || subCategories.trim() === "") {
//       return res.status(400).json({ message: 'Subcategory is required' });
//     }

//     // Find the category by ID
//     const category = await Category.findById(categoryId);

//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     // Update the category fields, using existing values if no new value is provided
//     category.name = name || category.name;
//     category.subCategories = subCategories; // Update the subCategories
//     category.collections = collections || category.collections;

//     // Save the updated category
//     const updatedCategory = await category.save();

//     // Respond with the updated category details
//     res.status(200).json(updatedCategory);
//   } catch (error) {
//     console.error('Error updating category:', error);
//     res.status(400).json({ message: 'Error updating category', error: error.message });
//   }
// };


// exports.updateCategory = async (req, res) => {
//   try {
//     const { name, subCategories, collections } = req.body;
//     const categoryId = req.params.id;  // ID of the category to be updated

//     // Check if subCategories is provided
//     if (!subCategories || subCategories.trim() === "") {
//       return res.status(400).json({ message: 'Subcategory is required' });
//     }

//     // Check if the subCategory already exists for other categories
//     const existingCategory = await Category.findOne({ subCategories, _id: { $ne: categoryId } });
//     if (existingCategory) {
//       return res.status(400).json({ message: 'Subcategory already exists' });
//     }

//     // Find the category by ID
//     const category = await Category.findById(categoryId);

//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     // Update the category fields
//     category.name = name || category.name;
//     category.subCategories = subCategories; // Update the subCategories
//     category.collections = collections || category.collections;

//     // Save the updated category
//     const updatedCategory = await category.save();

//     // Respond with the updated category details
//     res.status(200).json(updatedCategory);
//   } catch (error) {
//     console.error('Error updating category:', error);
//     res.status(400).json({ message: 'Error updating category', error: error.message });
//   }
// };




exports.updateCategory = async (req, res) => {
  try {
    const { name, subCategories, collections } = req.body;
    const categoryId = req.params.id;

    if (!subCategories || subCategories.trim() === "") {
      return res.status(400).json({ message: 'Subcategory is required' });
    }

    const existingCategory = await Category.findOne({ subCategories, _id: { $ne: categoryId } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Subcategory already exists' });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name || category.name;
    category.subCategories = subCategories;  // Update subCategories
    category.collections = collections || category.collections;

    // Recalculate vendor count
    category.vendorCount = 0;  // Reset vendor count
    const vendorsInCategory = await vendor.find({ profession: { $in: subCategories } });
    category.vendorCount = vendorsInCategory.length;  // Set new vendor count based on vendors in category

    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ message: 'Error updating category', error: error.message });
  }
};
