const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProduct);
router.get("/all", protect, getAllProducts);
router
  .route("/:id")
  .all(protect)
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
