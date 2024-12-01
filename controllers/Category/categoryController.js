const Category = require('../../models/Category/categoryModel');

// Controller to create a category
// exports.createCategory = async (req, res) => {
//     try {
//         const { name, subCategories, collections } = req.body;

//         // Create a new category instance
//         const newCategory = new Category({
//             name,
//             subCategories,
//             collections
//         });

//         // Save the category
//         const savedCategory = await newCategory.save();

//         // Respond with the created category
//         res.status(201).json(savedCategory);
//     } catch (error) {
//         console.error('Error creating category:', error);
//         res.status(400).json({ message: 'Error creating category', error: error.message });
//     }
// };

exports.createCategory = async (req, res) => {
    try {
      const { name, subCategories, collections } = req.body;
  
      // Check if the subCategory already exists
      const existingCategory = await Category.findOne({ subCategories });
      if (existingCategory) {
        return res.status(400).json({ message: 'Subcategory already exists' });
      }
  
      // Create a new category instance
      const newCategory = new Category({
        name,
        subCategories,
        collections
      });
  
      // Save the category
      const savedCategory = await newCategory.save();
  
      // Respond with the created category
      res.status(201).json(savedCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(400).json({ message: 'Error creating category', error: error.message });
    }
  };
  

// Controller to get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch all categories from the database
        res.status(200).json(categories); // Return the categories as a JSON response
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(400).json({ message: 'Error fetching categories', error: error.message });
    }
};
