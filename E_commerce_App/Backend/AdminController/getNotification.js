const jwt = require("jsonwebtoken");
const { JWTVerify } = require("../middlewares/auth");
const MyNotification = require("../models/notification");
async function getNotifications(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  const user = await JWTVerify(token);
  const id = user.userId;
  try {
    const notifications = await MyNotification.find({ user: id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: "Failed" });
  }
}
module.exports = { getNotifications };
