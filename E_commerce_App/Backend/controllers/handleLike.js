const Like = require("../models/like"); // Your like mongoose model
const { JWTVerify } = require("../middlewares/auth");

async function getLikesCount(req, res) {
  const { id } = req.params;
  try {
    const count = await Like.countDocuments({ product: id, isLiked: true });
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function checkUserLike(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = await JWTVerify(token);
    const userId = user.userId;
    const { id } = req.params;

    const like = await Like.findOne({
      product: id,
      user: userId,
      isLiked: true,
    });
    return res.status(200).json({ liked: !!like });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function toggleLike(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = await JWTVerify(token);
    const userId = user.userId;
    const { id } = req.params;

    const existingLike = await Like.findOne({ product: id, user: userId });

    if (existingLike) {
      existingLike.isLiked = !existingLike.isLiked;
      await existingLike.save();
      return res
        .status(200)
        .json({ message: existingLike.isLiked ? "Liked" : "Unliked" });
    } else {
      const newLike = new Like({ product: id, user: userId, isLiked: true });
      await newLike.save();
      return res.status(201).json({ message: "Liked" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { getLikesCount, checkUserLike, toggleLike };
