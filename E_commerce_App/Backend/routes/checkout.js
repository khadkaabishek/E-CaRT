const express = require("express");
const router = express.Router();
const Orders = require("./../models/order");
const {
  updateOrderStatus,
  getSellerOrders,
  handlePlaceOrders,
  getMyOrders,
} = require("./../controllers/handlePlaceOrders");
router.post("/place_order", handlePlaceOrders);
router.get("/my-orders/:userId", getMyOrders);
router.get("/seller-orders/:sellerId", getSellerOrders);
router.patch("/update-status/:orderId", updateOrderStatus);
const { JWTVerify } = require("./../middlewares/auth");
router.patch("/confirm-done/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }
    const decoded = await JWTVerify(token);
    const userId = decoded?.userId;

    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({ message: "Cannot confirm yet" });
    }

    order.status = "Done";
    await order.save();

    return res.json({ message: "Order marked as Done", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
