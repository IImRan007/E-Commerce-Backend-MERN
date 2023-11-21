const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

// @desc Create a new product
// @route POST /api/product
// @access Private
const createProduct = asyncHandler(async (req, res) => {
  let data = req?.body;

  if (!data?.category) {
    res.status(400);
    throw new Error("Please provide the category ID.");
  }

  const category = await Category.findById(data?.category);

  if (!req?.files) {
    res.status(400);
    throw new Error("Please provide the product image.");
  }

  if (req.files !== null && req.files !== undefined) {
    const uploadedImages = {};

    // Function to upload an image to Cloudinary
    const uploadImageToCloudinary = async (fieldName) => {
      if (req.files[fieldName]) {
        const uploadResponse = await cloudinary.uploader.upload(
          req.files[fieldName].tempFilePath,
          { folder: "E-Commerce" }
        );
        return {
          public_id: uploadResponse.public_id,
          secure_url: uploadResponse.secure_url,
        };
      }
      return null;
    };

    // Upload the 'productImage' image if found
    const productImage = await uploadImageToCloudinary("productImage");

    if (productImage) {
      uploadedImages.productImage = productImage;
    }

    // Update the data with the uploaded images
    data = {
      ...data,
      ...uploadedImages,
    };
  } else {
    // If no new image is provided, use the existing data
    data = req.body;
  }

  const product = await Product.create(data);

  res.status(201).json({ product, success: true });
});

// @desc Get product details
// @route GET /api/product/:id
const getProduct = asyncHandler(async (req, res) => {
  const productId = req?.params?.id;

  if (!productId) {
    res.status(400);
    throw new Error("Please provide the product Id.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  res.status(200).json({ product, success: true });
});

// @desc Get all products
// @route GET /api/product/all
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  if (!products || products.length === 0) {
    res.status(404);
    throw new Error("No Products Found!");
  }

  res.status(200).json({ products, success: true });
});

// @desc Update product details
// @route PUT /api/product/:id
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req?.params?.id;

  if (!productId) {
    res.status(400);
    throw new Error("Please provide the product Id.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product Not Found!");
  }

  let data = req.body;

  if (req.files !== null && req.files !== undefined) {
    const uploadedImages = {};

    // Function to upload an image to Cloudinary
    const uploadImageToCloudinary = async (fieldName, currentImagePublicId) => {
      if (req.files[fieldName]) {
        // Destroy the old image on Cloudinary if a new image is provided
        if (currentImagePublicId) {
          await cloudinary.uploader.destroy(currentImagePublicId);
        }

        const uploadResponse = await cloudinary.uploader.upload(
          req.files[fieldName].tempFilePath,
          { folder: "E-Commerce" }
        );
        return {
          public_id: uploadResponse.public_id,
          secure_url: uploadResponse.secure_url,
        };
      }
      // If no new image is provided, return null
      return null;
    };

    // Upload and update the 'productImage' image if found
    const productImage = await uploadImageToCloudinary(
      "productImage",
      product?.productImage?.public_id
    );
    if (productImage) {
      uploadedImages.productImage = productImage;
    }

    // Update the data with the uploaded images
    data = {
      ...data,
      ...uploadedImages,
    };
  } else {
    // If no new image is provided, use the existing data
    data = req.body;
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
    new: true,
  });

  res.status(200).json({ updatedProduct, success: true });
});

// @desc Delete Product
// @route DELETE /api/product/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req?.params?.id;

  if (!productId) {
    res.status(400);
    throw new Error("Please provide the product ID!");
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.productImage && product.productImage.public_id) {
    await cloudinary.uploader.destroy(product.productImage.public_id);
  }

  await Product.deleteOne({ _id: productId });

  res.status(200).json({ success: true });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
