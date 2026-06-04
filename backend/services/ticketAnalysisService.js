const analyzeTicketContent = (subject, message) => {
     const text = `${subject} ${message}`.toLowerCase();
       let category = "General";
  let priority = "Medium";
  let sentiment = "Neutral";
  let aiSummary = message.slice(0, 120);
    let aiSuggestedReply =
    "Thank you for contacting support. We are checking your issue and will update you shortly.";
      let aiSolutionSteps = [
    "Check the issue details",
    "Verify account and service status",
    "Review related logs",
    "Update the customer with solution",
  ];
    // Hosting / website down
  if (
    text.includes("website down") ||
    text.includes("site down") ||
    text.includes("503") ||
    text.includes("500 error") ||
    text.includes("server down")
  ) {
    category = "Hosting Issue";
    priority = "High";
    sentiment = "Frustrated";

    aiSummary = "User is reporting that the website or server is down.";

    aiSuggestedReply =
      "We are checking your hosting resource usage, server status, and error logs. Please allow us a few minutes to investigate.";

    aiSolutionSteps = [
      "Check server status",
      "Check hosting resource usage",
      "Check PHP/error logs",
      "Restart affected service if needed",
      "Update customer after verification",
    ];
  }
  // DNS issue
  else if (
    text.includes("dns") ||
    text.includes("nameserver") ||
    text.includes("vercel") ||
    text.includes("domain not working")
  ) {
    category = "DNS Issue";
    priority = "Medium";
    sentiment = "Confused";

    aiSummary = "User is facing DNS or domain connection related issue.";

    aiSuggestedReply =
      "We have checked your DNS configuration. DNS changes can take some time to propagate. Please wait and check again shortly.";

    aiSolutionSteps = [
      "Check nameserver configuration",
      "Verify DNS records",
      "Check propagation status",
      "Ask customer to wait if DNS was recently updated",
    ];
  }
    // Billing issue
  else if (
    text.includes("invoice") ||
    text.includes("payment") ||
    text.includes("billing") ||
    text.includes("refund")
  ) {
    category = "Billing Issue";
    priority = "Low";
    sentiment = "Neutral";

    aiSummary = "User has a billing, invoice, payment, or refund related question.";

    aiSuggestedReply =
      "Thank you for reaching out. We are reviewing your billing details and will update you shortly.";

    aiSolutionSteps = [
      "Check invoice details",
      "Verify payment status",
      "Confirm service status",
      "Reply with billing update",
    ];
  }
  // SSL issue
  else if (
    text.includes("ssl") ||
    text.includes("https") ||
    text.includes("certificate")
  ) {
    category = "SSL Issue";
    priority = "Medium";
    sentiment = "Concerned";

    aiSummary = "User is facing SSL or HTTPS certificate related issue.";

    aiSuggestedReply =
      "We are checking your SSL certificate status. Please make sure your domain is pointed correctly and allow some time for SSL activation.";

    aiSolutionSteps = [
      "Check domain DNS",
      "Check SSL certificate status",
      "Reissue SSL if needed",
      "Verify HTTPS access",
    ];
  }
  // Urgent words
  if (
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("customers cannot access") ||
    text.includes("business down")
  ) {
    priority = "Urgent";
    sentiment = "Angry";
  }

  return {
    category,
    priority,
    sentiment,
    aiSummary,
    aiSuggestedReply,
    aiSolutionSteps,
  };
};

module.exports = {
  analyzeTicketContent,
};