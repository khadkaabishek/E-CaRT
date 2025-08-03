const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Dispatched", "Delivered", "Cancelled", "Done"],
      default: "Pending",
    },
    items: { type: [OrderItemSchema], required: true, default: [] },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", OrderSchema);
module.exports = Order;
