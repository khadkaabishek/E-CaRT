const SellerInfo = require("./../models/sellerInfo");
const { JWTVerify } = require("./../middlewares/auth");
const handleBecomeSeller = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = await JWTVerify(token);

    const { email, phone, address } = req.body;
    const nidFront = req.files.nidFront?.[0]?.filename;
    const nidBack = req.files.nidBack?.[0]?.filename;
    const addressProof = req.files.addressProof?.[0]?.filename;
    if (!nidFront || !nidBack || !addressProof) {
      return res.status(400).json({ message: "All documents are required" });
    }

    const newApplication = new SellerInfo({
      id: user.userId,
      email,
      phone,
      address,
      nidFront,
      nidBack,
      addressProof,
    });
    await newApplication.save();
  } catch (err) {
    return res.status(500).json({ message: " Error encountered" });
  }
  return res
    .status(201)
    .json({ message: "Application submitted successfully" });
};

module.exports = { handleBecomeSeller };
