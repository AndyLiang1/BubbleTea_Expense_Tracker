const express = require("express");
const router = express.Router();
const { sequelize } = require("../Db");

/*
 * These routes are used for testing. Hence, they have very little documentation.
 */

// =============================================================================
// Clear tables
// =============================================================================

router.delete("/clearUsers", async (req, res) => {
  const result = await sequelize.query("DELETE FROM users");
  res.json(result)
});

router.delete("/clearPurchases", async (req, res) => {
  const result = await sequelize.query("DELETE FROM purchases");
  res.json(result)
});

module.exports = router