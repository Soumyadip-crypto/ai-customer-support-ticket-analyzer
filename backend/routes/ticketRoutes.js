const express = require("express");

const {
  createTicket,
  getMyTickets,
  getTicketById,
  getAllTickets,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
  getTicketStats,
} = require("../controllers/ticketController");

const {
  addTicketReply,
} = require("../controllers/ticketReplyController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, createTicket);

// admin/support routes
router.get(
  "/",
  protect,
  authorizeRoles("admin", "support"),
  getAllTickets
);

router.get(
  "/stats",
  protect,
  authorizeRoles("admin", "support"),
  getTicketStats
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "support"),
  updateTicketStatus
);

router.put(
  "/:id/assign",
  protect,
  authorizeRoles("admin", "support"),
  assignTicket
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTicket
);

// user routes
router.get("/my", protect, getMyTickets);
router.get("/:id", protect, getTicketById);
router.post("/:id/reply", protect, addTicketReply);

module.exports = router;