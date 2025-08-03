const Orders = require("../models/order");
const Cart = require("../models/userCart");
const MyNotification = require("../models/Notification");
const User = require("../models/User");
const { JWTVerify } = require("./../middlewares/auth");
const Order = require("../models/order");
const Product = require("../models/Product");

async function handlePlaceOrders(req, res) {
  try {
    const { user, contact, cart } = req.body;
    if (!user || !contact || !cart) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Load cart with product + owner (we need product + seller info)
    const cartData = await Cart.findById(cart).populate({
      path: "items.product",
      populate: { path: "owner", select: "name email" },
    });

    if (!cartData) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (!cartData.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Snapshot items for order
    const orderItems = cartData.items.map((ci) => ({
      product: ci.product._id,
      quantity: ci.quantity,
    }));

    // Create order using snapshot
    const newOrder = await Orders.create({
      user,
      contact,
      items: orderItems,
    });

    // Decrease product quantityAvailable
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantityAvailable -= item.quantity;
        if (product.quantityAvailable < 0) product.quantityAvailable = 0;
        await product.save();
      }
    }

    // Notifications
    const buyer = await User.findById(user).select("name email");
    const sellers = new Map();

    cartData.items.forEach((item) => {
      const p = item.product;
      if (p?.owner?._id) {
        const ownerId = p.owner._id.toString();
        if (!sellers.has(ownerId)) {
          sellers.set(ownerId, { ownerId, productNames: [p.name] });
        } else {
          sellers.get(ownerId).productNames.push(p.name);
        }
      }
    });

    const notifications = [];
    for (const [ownerId, data] of sellers.entries()) {
      notifications.push({
        user: ownerId,
        message: `Your product(s) ${data.productNames.join(
          ", "
        )} have been ordered by ${buyer?.name || "a buyer"}.`,
        from: user,
      });
    }

    if (notifications.length) {
      await MyNotification.insertMany(notifications);
    }

    await Cart.deleteOne({ _id: cart });

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
      notificationsCreated: notifications.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while placing order",
      error: error.message,
    });
  }
}

// Get My Orders (now populate items.product.owner)
async function getMyOrders(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ user: userId })
      .populate({
        path: "items.product",
        populate: { path: "owner", select: "name email" },
      })
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(200).json({ message: "No orders found", orders: [] });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching orders",
      error: error.message,
    });
  }
}

async function getSellerOrders(req, res) {
  try {
    const { sellerId } = req.params;
    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const allOrders = await Orders.find()
      .populate({
        path: "items.product",
        populate: { path: "owner", select: "name email" },
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const sellerOrders = [];
    for (const order of allOrders) {
      const sellerItems = order.items.filter(
        (itm) =>
          itm.product?.owner?._id &&
          itm.product.owner._id.toString() === sellerId
      );
      if (sellerItems.length) {
        sellerOrders.push({
          _id: order._id,
          buyer: order.user,
          contact: order.contact,
          status: order.status,
          createdAt: order.createdAt,
          items: sellerItems,
        });
      }
    }

    return res.status(200).json({
      orders: sellerOrders,
      message: sellerOrders.length ? undefined : "No orders found",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching seller orders",
      error: error.message,
    });
  }
}
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }
    const decoded = await JWTVerify(token);
    const sellerId = decoded?.userId;
    if (!sellerId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const ALLOWED = ["Dispatched", "Delivered"];
    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await Order.findById(orderId)
      .populate({
        path: "items.product",
        populate: { path: "owner", select: "name email" },
      })
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const sellerOwnsProduct = order.items.some((item) => {
      const owner = item.product?.owner;

      if (!owner) return false;
      const ownerId =
        typeof owner === "object" && owner._id
          ? owner._id.toString()
          : owner.toString();
      return ownerId === sellerId;
    });

    if (!sellerOwnsProduct) {
      return res.status(403).json({
        message: "Unauthorized: You do not own any product in this order.",
      });
    }

    order.status = status;
    await order.save();

    if (status === "Delivered") {
      await MyNotification.create({
        user: order.user._id || order.user,
        message: "Your order has been delivered! Please confirm if it's done.",
        from: sellerId,
      });
    }

    return res.json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  handlePlaceOrders,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
};
