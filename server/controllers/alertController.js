const { Alert } = require("../models");
const { Op } = require("sequelize");

// POST /alerts
// Generate random alert
const severities = ["Low", "Medium", "High", "Critical"];
const tactics = [
  "Initial Access",
  "Persistence",
  "Privilege Escalation",
  "Exfiltration",
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const generateRandomAlert = async (req, res) => {
  try {
    const alertData = {
      type: "Simulated",
      message: `Auto-generated at ${new Date().toISOString()}`,
      severity: getRandomElement(severities),
      tactic: getRandomElement(tactics),
      userId: req.user.userId,
    };

    const newAlert = await Alert.create(alertData);
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /alerts
const getAlerts = async (req, res) => {
  const { severity, tactic, page = 1, limit = 10, q } = req.query;
  const offset = (page - 1) * limit;

  const where = { userId: req.user.userId };

  if (severity) where.severity = severity;
  if (tactic) where.tactic = tactic;
  if (q) where.message = { [Op.iLike]: `%${q}%` };

  try {
    const alerts = await Alert.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      total: alerts.count,
      page: parseInt(page),
      pages: Math.ceil(alerts.count / limit),
      data: alerts.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /alerts
const createAlert = async (req, res) => {
  const { type, message, severity, tactic } = req.body;
  try {
    const alert = await Alert.create({
      type,
      message,
      severity,
      tactic,
      userId: req.user.userId,
    });
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /alerts/:id
const deleteAlert = async (req, res) => {
  const alertId = req.params.id;
  try {
    const alert = await Alert.findOne({
      where: { id: alertId, userId: req.user.userId },
    });

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    await alert.destroy();
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GENERATE /generate

module.exports = { getAlerts, createAlert, deleteAlert, generateRandomAlert };
