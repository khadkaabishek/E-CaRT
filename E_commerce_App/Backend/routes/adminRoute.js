const express = require("express");
const router = express.Router();

const {
  viewUsers,
  viewRequest,
  updateRequestStatus,
  viewSeller,
} = require("../AdminController/request");

router.get("/viewRequest", viewRequest);
router.patch("/updateRequestStatus/:id", updateRequestStatus);
router.get("/viewUsers", viewUsers);
router.get("/viewSellers", viewSeller);
module.exports = router;
