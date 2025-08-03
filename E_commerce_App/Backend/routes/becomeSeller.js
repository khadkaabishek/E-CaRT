const express = require("express");
const router = express();
const multer = require("multer");
const { handleBecomeSeller } = require("./../controllers/handleBecomeSeller");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/SellerData/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/:id",
  upload.fields([
    { name: "nidFront", maxCount: 1 },
    { name: "nidBack", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
  ]),
  handleBecomeSeller
);
module.exports = router;
