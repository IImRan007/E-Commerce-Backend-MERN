const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");

// @desc Create a new category
// @route POST /api/category
// @access Private
const createCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    res.status(400);
    throw new Error("Please provide the category name.");
  }

  const categoryExists = await Category.findOne({ categoryName });

  if (categoryExists) {
    res.status(400);
    throw new Error("Category Already Exists!");
  }

  const category = await Category.create({ categoryName });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error("Category creation failed.");
  }
});

// @desc Get category
// @route GET /api/category/:id
// @access Public
const getCategory = asyncHandler(async (req, res) => {
  const categoryId = req?.params?.id;

  if (!categoryId) {
    res.status(400);
    throw new Error("Please provide the category Id.");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category Not Found!");
  }

  res.status(200).json({ category, success: true });
});

// @desc Get all categories
// @route GET /api/category/all
// @access Public
const getAllCategories = asyncHandler(async (req, res) => {
  const category = await Category.find();

  if (!category || category.length === 0) {
    res.status(404);
    throw new Error("Categories Not Found!");
  }

  res.status(200).json({ category, success: true });
});

// @desc Update Category
// @route PUT /api/category/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req?.params?.id;

  if (!categoryId) {
    res.status(400);
    throw new Error("Please provide the category Id.");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category Not Found!");
  }

  const data = req?.body;

  const updatedCategory = await Category.findByIdAndUpdate(categoryId, data, {
    new: true,
  });

  res.status(200).json({ updatedCategory, success: true });
});

// @desc Delete Category
// @route DELETE /api/category/:id
// @access Private
const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req?.params?.id;

  if (!categoryId) {
    res.status(400);
    throw new Error("Please provide the category Id.");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category Not Found!");
  }

  await Category.deleteOne({ _id: categoryId });

  res.status(200).json({ success: true });
});

module.exports = {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
