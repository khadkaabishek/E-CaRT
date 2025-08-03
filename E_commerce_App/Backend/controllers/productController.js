const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { owner, name, description, price, category, quantityAvailable } =
      req.body;

    const image = req.file?.path;

    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "All fields are required including image." });
    }

    const product = new Product({
      owner,
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      quantityAvailable,
    });

    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createProduct };
