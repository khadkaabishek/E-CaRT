const mongoose = require("mongoose");
const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },

  { timestamps: true }
);

const MyNotification =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);
module.exports = MyNotification;
