const getChatbotReply = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes("503") ||
    text.includes("website down") ||
    text.includes("site down") ||
    text.includes("server down")
  ) {
    return {
      reply:
        "Your website may be down due to high resource usage, PHP error, or server issue. Please check error logs, disable heavy plugins, and verify hosting resource usage. If the issue continues, you can create a support ticket.",
      shouldCreateTicket: true,
      category: "Hosting Issue",
    };
  }

  if (
    text.includes("dns") ||
    text.includes("nameserver") ||
    text.includes("vercel") ||
    text.includes("domain")
  ) {
    return {
      reply:
        "This looks like a DNS or domain issue. Please check your nameservers and DNS records. DNS changes may take some time to propagate.",
      shouldCreateTicket: true,
      category: "DNS Issue",
    };
  }

  if (
    text.includes("ssl") ||
    text.includes("https") ||
    text.includes("certificate")
  ) {
    return {
      reply:
        "This seems related to SSL. Please make sure your domain is pointed correctly. SSL activation may take some time. If it still does not work, create a ticket.",
      shouldCreateTicket: true,
      category: "SSL Issue",
    };
  }

  if (
    text.includes("payment") ||
    text.includes("invoice") ||
    text.includes("billing") ||
    text.includes("refund")
  ) {
    return {
      reply:
        "This seems like a billing issue. Please check your invoice and payment status. Our support team can review it if you create a ticket.",
      shouldCreateTicket: true,
      category: "Billing Issue",
    };
  }

  return {
    reply:
      "I understand your issue. Please explain a little more, or create a support ticket so our team can check it properly.",
    shouldCreateTicket: true,
    category: "General",
  };
};

module.exports = {
  getChatbotReply,
};