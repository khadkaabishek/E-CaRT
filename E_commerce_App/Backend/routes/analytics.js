const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("./../models/order.js");
const Product = require("./../models/Product.js");
const User = require("./../models/user");
router.get("/:id", async (req, res) => {
  const ownerId = new mongoose.Types.ObjectId(req.params.id);

  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $match: {
          "productDetails.owner": ownerId,
        },
      },
      {
        $group: {
          _id: {
            productId: "$productDetails._id",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          productName: { $first: "$productDetails.name" },
          quantitySold: { $sum: "$items.quantity" },
        },
      },
      {
        $group: {
          _id: "$_id.productId",
          productName: { $first: "$productName" },
          totalSold: { $sum: "$quantitySold" },
          salesByDay: {
            $push: {
              date: "$_id.date",
              quantity: "$quantitySold",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: 1,
          totalSold: 1,
          salesByDay: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics fetch failed" });
  }
});

module.exports = router;
