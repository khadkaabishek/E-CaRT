const { JWTVerify } = require("../middlewares/auth");
const Interaction = require("../models/interactions");

async function postInteraction(req, res) {
  try {
    const { comment } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    const user = await JWTVerify(token);

    const userId = user.userId;

    const { id } = req.params;

    const newInteraction = new Interaction({
      comment: comment,
      product: id,
      user: userId,
    });

    await newInteraction.save();
    return res.status(201).json({ msg: "New comment added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
async function getInteraction(req, res) {
  const { id } = req.params;

  try {
    const interactions = await Interaction.find({ product: id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(interactions);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { postInteraction, getInteraction };
