const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema(
  {
    isLiked: {
      type: Boolean,
      required: true,
      enum: [0, 1],
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
const Like = mongoose.model("like", likeSchema);
module.exports = Like;
