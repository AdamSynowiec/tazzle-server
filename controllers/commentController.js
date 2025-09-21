const { executeQuery } = require("../database/dbQuery");

// Pobranie komentarzy
const getComment = async (req) => {
  const { id } = req.params; // np. 'NBP-1'
  const [projectKey, ticketNumber] = id.split("-");

  // Pobierz ticket_id
  const ticketResult = await executeQuery(
    `SELECT t.ticket_id
     FROM Tickets t
     INNER JOIN Projects pr ON t.project_id = pr.project_id
     WHERE t.ticket_number = ? AND pr.project_key = ?`,
    [ticketNumber, projectKey]
  );

  if (!ticketResult || ticketResult.length === 0) {
    throw new Error("Ticket not found");
  }

  const ticket_id = ticketResult[0].ticket_id;

  // Pobierz komentarze
  const comments = await executeQuery(
    `SELECT comment_id, comment_text as ticketComments, user_id as userID, created_at as CreatedAt
     FROM Comments
     WHERE ticket_id = ? ORDER BY created_at ASC`,
    [ticket_id]
  );

  return comments;
};

// Dodanie komentarza
const setComment = async (req) => {
  const { ticketId, userId, commentText } = req.body;

  if (!ticketId || !userId || !commentText) {
    throw new Error("ticketId, userId and commentText are required");
  }

  const result = await executeQuery(
    `INSERT INTO Comments (ticket_id, user_id, comment_text, created_at, updated_at)
     VALUES (?, ?, ?, NOW(), NOW())`,
    [ticketId, userId, commentText]
  );

  // Zwróć nowy komentarz
  const newComment = await executeQuery(
    `SELECT comment_id, comment_text as ticketComments, user_id as userID, created_at as CreatedAt
     FROM Comments WHERE comment_id = ?`,
    [result.insertId]
  );

  return newComment[0];
};

module.exports = { getComment, setComment };
