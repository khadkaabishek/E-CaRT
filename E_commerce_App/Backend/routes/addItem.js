const express = require("express");
const router = express.Router();
const { createProduct } = require("../controllers/productController");
const upload = require("../middlewares/upload");
const {
  getProduct,
  getMyItems,
  putProduct,
  patchProduct,
  deleteProduct,
  getSingleItem,
} = require("../controllers/productManipulate");
const {
  postInteraction,
  getInteraction,
} = require("../controllers/Interaction");
const { protect, restrictTo } = require("../middlewares/auth");
const {
  getLikesCount,
  checkUserLike,
  toggleLike,
} = require("../controllers/handleLike");

router.post(
  "/add_item",
  upload.single("image"),
  protect,
  restrictTo("admin", "seller"),
  createProduct
);

router.get("/get_item", getProduct);
router.get("/get-item/:id", getSingleItem);
router.put(
  "/put_item/:id",
  protect,
  restrictTo("admin", "seller"),
  upload.array("images", 5),
  putProduct
);
router.patch(
  "/patch_item/:id",
  protect,
  restrictTo("admin", "seller"),
  patchProduct
);
router.delete(
  "/delete_item/:id",
  protect,
  restrictTo("admin", "seller"),
  deleteProduct
);
router.get("/:id/get-my-items", getMyItems);

router.get("/:id/interaction", getInteraction);
router.post("/:id/interaction", protect, postInteraction);

router.get("/:id/likes", getLikesCount);
router.get("/:id/likes/check", protect, checkUserLike);
router.patch("/:id/likes/toggle", protect, toggleLike);

module.exports = router;
