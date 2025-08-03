const mongoose = require("mongoose");
const googleUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "seller", "admin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const googleUser = mongoose.model("googleUser", googleUserSchema);
module.exports = googleUser;
