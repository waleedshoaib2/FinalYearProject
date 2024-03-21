import Category from "../models/categoryModel.js";

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(req.formData);

    // Check if request body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Please provide name and description' }); 
    }

    const newCategory = new Category({ name, description });

    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const getCategory = async (req, res) => {
  const pageSize = 6; 
  const page = parseInt(req.query.pageNumber) || 1;

  let filterKeyword = [{}];
  let sortKeyword;
  if (req.query.sortBy && req.query.sortBy !== "null") {
    // Add fields you want to sort by
    if (req.query.sortBy === "ascname") {
      sortKeyword = { name: 1 };
    } else if (req.query.sortBy === "descname") {
      sortKeyword = { name: -1 };
    } 
    // ... Add more sorting options
  } else {
    sortKeyword = {}; 
  }

  try {
    const count = await Category.countDocuments({ $and: filterKeyword });
    const categories = await Category.find({ $and: filterKeyword })
                                 .sort(sortKeyword)
                                 .limit(pageSize)
                                 .skip(pageSize * (page - 1));

    res.json({ categories, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(404).json({ message: "Categories not found" });
  }
};


// Get Category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // To return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategory
};
