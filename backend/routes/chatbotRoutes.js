const express = require("express");

const {
  sendChatMessage,
  getChatHistory,
  createTicketFromChat,
} = require("../controllers/chatbotController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/message", protect, sendChatMessage);
router.get("/history", protect, getChatHistory);
router.post("/create-ticket", protect, createTicketFromChat);

module.exports = router;