const MyNotification = require("../models/notification");
const SellerInfo = require("../models/sellerInfo");
const User = require("./../models/user");
async function viewRequest(req, res) {
  try {
    const sellerInfo = await SellerInfo.find();
    return res.status(200).json(sellerInfo);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
}

async function updateRequestStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  try {
    const updatedSeller = await SellerInfo.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    if (status === "approved") {
      await User.findByIdAndUpdate(
        updatedSeller.id,
        { role: "seller" },
        { new: true }
      );

      await MyNotification.create({
        user: updatedSeller.id,
        message:
          "Your request to be seller has been accepted , login with original credential for Seller Access",
        from: "686160b656334582e44785b8",
      });
    }
    if (status === "rejected") {
      await MyNotification.create({
        user: id,
        message:
          "Your request to be seller has been Rejected , fillup the form again with correct information ",
        from: "686160b656334582e44785b8",
      });
    }
    return res
      .status(200)
      .json({ message: `Seller ${status}`, seller: updatedSeller });
  } catch (error) {
    return res.status(500).json({ message: "Error updating status", error });
  }
}
async function viewUsers(req, res) {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}
async function viewSeller(req, res) {
  try {
    const sellers = await User.find({ role: "seller" }).select("-password");

    const applications = await SellerInfo.find({});

    const enrichedSellers = sellers.map((seller) => {
      const matchingApp = applications.find(
        (app) => app.id.toString() === seller._id.toString()
      );

      return {
        ...seller.toObject(),
        sellerInfo: matchingApp || null,
      };
    });

    res.status(200).json(enrichedSellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error });
  }
}

module.exports = {
  viewRequest,
  updateRequestStatus,
  viewUsers,
  viewSeller,
};
