const mongoose = require("mongoose");
const interActionSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Interaction = mongoose.model("Interaction", interActionSchema);
module.exports = Interaction;
