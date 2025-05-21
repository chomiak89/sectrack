const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getAlerts,
  createAlert,
  deleteAlert,
  generateRandomAlert,
  getMetrics,
} = require("../controllers/alertController");

router.use(verifyToken); // protect all routes below

router.get("/", getAlerts);
router.post("/", createAlert);
router.delete("/:id", deleteAlert);
router.post("/generate", generateRandomAlert);
router.get("/metrics", getMetrics);

module.exports = router;
