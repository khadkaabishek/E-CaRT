const express = require("express");
const router = express.Router();
const { cartRoute } = require("./../controllers/cartController");
const Cart = require("./../models/userCart");
const Product = require("./../models/Product"); // ✅ Ensure it's registered

router.post("/", cartRoute);

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:userId/update-quantity", async (req, res) => {
  const { productId, action } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(400).json({ message: "User cart not found" });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (action === "increment") item.quantity += 1;
    else if (action === "decrement" && item.quantity > 1) item.quantity -= 1;

    await cart.save();
    return res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:userId/remove-item", async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    return res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
