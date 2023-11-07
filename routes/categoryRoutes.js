const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createCategory);
router.get("/all", protect, getAllCategories);
router
  .route("/:id")
  .all(protect)
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
