const Ticket = require("../models/Ticket");
const TicketReply = require("../models/TicketReply");
// add reply to ticket
const addTicketReply = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authorized",
      });
    }
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ message: "Reply message is required" });
    }
    const ticket = await Ticket.findById(req.params.id).populate(
      "user",
      "name email role",
    );
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
    const reply = await TicketReply.create({
      ticket: ticket._id,
      sender: req.user._id,
      message,
    });
    // support/admin reply korle status pending kore dilam
    if (isStaff && ticket.status === "open") {
      ticket.status = "pending";
      await ticket.save();
    }
    const populatedReply = await reply.populate("sender", "name email role");

    res.status(201).json({
      message: "Reply added successfully",
      reply: populatedReply,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add reply",
      error: error.message,
    });
  }
};
module.exports = {
  addTicketReply,
};
