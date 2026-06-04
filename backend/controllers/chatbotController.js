const ChatMessage = require("../models/ChatMessage");
const Ticket = require("../models/Ticket");

const generateTicketId = require("../utils/generateTicketId");
const { getChatbotReply } = require("../services/chatbotService");
const { analyzeTicketContent } = require("../services/ticketAnalysisService");
// send message to chatbot
const sendChatMessage = async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const userMessage = await ChatMessage.create({
      user: req.user._id,
      sender: "user",
      message,
    });

    const botResponse = getChatbotReply(message);

    const aiMessage = await ChatMessage.create({
      user: req.user._id,
      sender: "ai",
      message: botResponse.reply,
    });

    res.json({
      message: "Chatbot replied successfully",
      userMessage,
      aiReply: aiMessage,
      shouldCreateTicket: botResponse.shouldCreateTicket,
      category: botResponse.category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Chatbot failed",
      error: error.message,
    });
  }
};
// get chat history
const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .populate("createdTicket", "ticketId subject status priority")
      .sort({ createdAt: 1 });

    res.json({
      message: "Chat history fetched successfully",
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch chat history",
      error: error.message,
    });
  }
};
// create ticket from chatbot
const createTicketFromChat = async (req, res) => {
  try {
    const { subject, message } = req.body || {};

    if (!subject || !message) {
      return res.status(400).json({
        message: "Subject and message are required",
      });
    }

    const analysis = analyzeTicketContent(subject, message);

    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      user: req.user._id,
      subject,
      message,
      category: analysis.category,
      priority: analysis.priority,
      sentiment: analysis.sentiment,
      aiSummary: analysis.aiSummary,
      aiSuggestedReply: analysis.aiSuggestedReply,
      aiSolutionSteps: analysis.aiSolutionSteps,
    });

    const aiMessage = await ChatMessage.create({
      user: req.user._id,
      sender: "ai",
      message: `Support ticket created successfully. Ticket ID: ${ticket.ticketId}`,
      createdTicket: ticket._id,
    });

    res.status(201).json({
      message: "Ticket created from chatbot successfully",
      ticket,
      chatMessage: aiMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ticket from chatbot",
      error: error.message,
    });
  }
};
module.exports = {
  sendChatMessage,
  getChatHistory,
  createTicketFromChat,
};
