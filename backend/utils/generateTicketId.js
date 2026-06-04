const generateTicketId = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  return `TKT-${randomNumber}`;
};

module.exports = generateTicketId;