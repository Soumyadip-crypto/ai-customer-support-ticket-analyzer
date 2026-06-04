const Ticket = require("../models/Ticket");
const TicketReply = require("../models/TicketReply");
const generateTicketId = require("../utils/generateTicketId");
const User = require("../models/User");
const { analyzeTicketContent } = require("../services/ticketAnalysisService");

// create ticket
const createTicket = async (req, res) => {
  try {
    const { subject, message, priority } = req.body;

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
      category: analysis.category || "General",
      priority: priority || analysis.priority || "Medium",
      sentiment: analysis.sentiment || "Neutral",
      aiSummary: analysis.aiSummary || "",
      aiSuggestedReply: analysis.aiSuggestedReply || "",
      aiSolutionSteps: analysis.aiSolutionSteps || [],
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ticket creation failed",
      error: error.message,
    });
  }
};

// get logged-in user's tickets with search/filter/pagination
const getMyTickets = async (req, res) => {
  try {
    const {
      search = "",
      status,
      priority,
      category,
      page = 1,
      limit = 5,
    } = req.query;

    const query = {
      user: req.user._id,
    };

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { ticketId: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Ticket.countDocuments(query);

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      message: "My tickets fetched successfully",
      count: tickets.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

// get single ticket
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("user", "name email role")
      .populate("assignedTo", "name email role");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const isOwner = ticket.user._id.toString() === req.user._id.toString();
    const isStaff = req.user.role === "admin" || req.user.role === "support";

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        message: "You are not allowed to view this ticket",
      });
    }

    const replies = await TicketReply.find({ ticket: ticket._id })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    res.json({
      message: "Ticket fetched successfully",
      ticket,
      replies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ticket",
      error: error.message,
    });
  }
};

// admin/support: get all tickets with search/filter/pagination
const getAllTickets = async (req, res) => {
  try {
    const {
      search = "",
      status,
      priority,
      category,
      page = 1,
      limit = 5,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { ticketId: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Ticket.countDocuments(query);

    const tickets = await Ticket.find(query)
      .populate("user", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      message: "All tickets fetched successfully",
      count: tickets.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all tickets",
      error: error.message,
    });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["Open", "Pending", "Resolved", "Closed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    ticket.status = status;
    await ticket.save();

    res.json({
      message: "Ticket status updated successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update ticket status",
      error: error.message,
    });
  }
};

const assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        message: "assignedTo user id is required",
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const assignedUser = await User.findById(assignedTo);

    if (!assignedUser) {
      return res.status(404).json({
        message: "Assigned user not found",
      });
    }

    if (assignedUser.role !== "support" && assignedUser.role !== "admin") {
      return res.status(400).json({
        message: "Ticket can only be assigned to support or admin",
      });
    }

    ticket.assignedTo = assignedTo;
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("user", "name email role")
      .populate("assignedTo", "name email role");

    res.json({
      message: "Ticket assigned successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign ticket",
      error: error.message,
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    await TicketReply.deleteMany({ ticket: ticket._id });
    await ticket.deleteOne();

    res.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ticket",
      error: error.message,
    });
  }
};

const getTicketStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "Open" });
    const pendingTickets = await Ticket.countDocuments({ status: "Pending" });
    const resolvedTickets = await Ticket.countDocuments({ status: "Resolved" });
    const closedTickets = await Ticket.countDocuments({ status: "Closed" });
    const highPriorityTickets = await Ticket.countDocuments({
      priority: "High",
    });

    res.json({
      message: "Ticket stats fetched successfully",
      stats: {
        totalTickets,
        openTickets,
        pendingTickets,
        resolvedTickets,
        closedTickets,
        highPriorityTickets,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ticket stats",
      error: error.message,
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  getAllTickets,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
  getTicketStats,
};