const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getAlerts,
  createAlert,
  deleteAlert,
} = require("../controllers/alertController");

router.use(verifyToken); // protect all routes below

router.get("/", getAlerts);
router.post("/", createAlert);
router.delete("/:id", deleteAlert);

module.exports = router;
