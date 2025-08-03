const axios = require("axios");
const { oauuth2client } = require("../utils/googleConfig");
const googleUser = require("../models/googleAuth");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const MyNotification = require("./../models/notification");
const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauuth2client.getToken(code);

    oauuth2client.setCredentials(tokens);
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const { id: googleId, email, name, picture } = userRes.data;
    const image = picture;
    const isVerified = true;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, image, googleId, isVerified });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    await MyNotification.create({
      user: user._id,
      message: ` New login detected  via Google`,
      from: "686160b656334582e44785b8",
    });

    return res.status(200).json({ message: "success", token, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { googleLogin };
