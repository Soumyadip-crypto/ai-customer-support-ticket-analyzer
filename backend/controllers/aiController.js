const Ticket = require("../models/Ticket");
const { analyzeTicketContent } = require("../services/ticketAnalysisService");

const analyzeTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const analysis = analyzeTicketContent(ticket.subject, ticket.message);

    ticket.category = analysis.category;
    ticket.priority = analysis.priority;
    ticket.sentiment = analysis.sentiment;
    ticket.aiSummary = analysis.aiSummary;
    ticket.aiSuggestedReply = analysis.aiSuggestedReply;
    ticket.aiSolutionSteps = analysis.aiSolutionSteps;

    await ticket.save();

    res.json({
      message: "Ticket analyzed successfully",
      analysis,
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ticket analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeTicket,
};