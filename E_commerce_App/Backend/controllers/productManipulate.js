const Product = require("../models/Product");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const jwt = require("jsonwebtoken");
const sellerInfo = require("../models/sellerInfo");
const getProduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
};
const getSingleItem = async (req, res) => {
  const { id } = req.params;

  try {
    const SingleItem = await Product.findById({ _id: id }).populate(
      "owner",
      "name email"
    );

    if (!SingleItem) {
      return res.status(404).json({ message: "Product not found" });
    }

    const Seller_Info = await sellerInfo.findOne({ id: SingleItem.owner._id });

    if (Seller_Info) {
      SingleItem.owner = {
        ...SingleItem.owner.toObject(),
        official_email: Seller_Info.email,
      };
    }

    return res.json(SingleItem);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getMyItems = async (req, res) => {
  const { id } = req.params;
  try {
    const MyItems = await Product.find({ owner: id });
    return res.status(200).json(MyItems);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch products." });
  }
};
const putProduct = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  const user = jwt.verify(token, JWT_SECRET);
  try {
    const product = await Product.findById({ _id: id });
    const isOwner = await product.compareOwner(user.userId);
    if (isOwner) {
      const { name, description, price, quantity, category } = req.body;
      const imagePaths =
        req.files?.map((file) => `/uploads/${file.filename}`) || [];

      const updatedData = {
        name,
        description,
        price: Number(price),
        quantityAvailable: Number(quantity),
        category,
      };
      if (imagePaths.length > 0) {
        updatedData.images = imagePaths;
      }

      const updated = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      if (!updated)
        return res.status(404).json({ error: "Product not found." });

      res.status(200).json({ msg: "success", updated });
    } else {
      return res
        .status(401)
        .json({ msg: "This is not your Product Okay ! Mind it " });
    }
  } catch (error) {
    res.status(400).json({ error: error.message || "Something went wrong." });
  }
};
const patchProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found." });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to patch product." });
  }
};

const deleteProduct = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  const user = jwt.verify(token, JWT_SECRET);
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    const isOwner = await product.compareOwner(user.userId);
    if (!isOwner)
      return res.status(401).json({ message: "This is not your product" });
    const deleted = await Product.findByIdAndDelete({ _id: id });
    if (!deleted) return res.status(404).json({ error: "Product not found." });
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete product." });
  }
};

module.exports = {
  getProduct,
  getMyItems,
  putProduct,
  patchProduct,
  deleteProduct,
  getSingleItem,
};
