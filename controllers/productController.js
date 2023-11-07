const asyncHandler = require("express-async-handler");

const Product = require("../models/productModel");

// @desc Create a new product
// @route POST /api/product
// @access Private
const createProduct = asyncHandler(async (req, res) => {
  let data = req?.body;

  if (req.files !== null && req.files !== undefined) {
    const uploadedImages = {};

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

module.exports = { createProduct };
