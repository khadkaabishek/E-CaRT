const Cart = require("./../models/userCart");
const Product = require("./../models/Product");
async function cartRoute(req, res) {
  try {
    const { user, product, quantity } = req.body;
    let cart = await Cart.findOne({ user: user });

    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === product
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product, quantity });
      }
      await cart.save();
    } else {
      const newCart = new Cart({
        user,
        items: [{ product, quantity }],
      });

      await newCart.save();
    }

    return res.status(201).json({ msg: "Item added to cart successfully" });
  } catch (error) {
    return res.status(500).json({ err: "Error occurred while adding to cart" });
  }
}

module.exports = { cartRoute };
