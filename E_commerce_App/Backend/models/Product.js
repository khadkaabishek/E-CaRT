const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: [{ type: String, required: false }],
    quantityAvailable: { type: Number, required: true, default: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
ProductSchema.methods.compareOwner = async function (id_params) {
  try {
    if (this.owner == id_params) return true;
    return false;
  } catch (error) {}
};
const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
