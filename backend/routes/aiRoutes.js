const express = require("express");

const { analyzeTicket } = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/analyze-ticket/:id",
  protect,
  authorizeRoles("admin", "support"),
  analyzeTicket
);

module.exports = router;