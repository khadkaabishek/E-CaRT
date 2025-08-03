const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

async function JWTVerify(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
}

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await JWTVerify(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message || "Invalid token" });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        message: "You do not have permission for this action",
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo, JWTVerify };
