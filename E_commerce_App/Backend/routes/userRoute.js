const express = require("express");
const { getNotifications } = require("../AdminController/getNotification");
const router = express();
router.get("/getNotification", getNotifications);
module.exports = router;
