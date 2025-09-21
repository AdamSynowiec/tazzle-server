const { executeQuery } = require("../database/dbQuery");

const getBrowse = async (req) => {
  const { id } = req.params; // np. 'NBP-1'
  const [projectKey, ticketNumber] = id.split("-");

  const query = `
    SELECT 
      t.ticket_id,
      t.ticket_number,
      t.ticket_title,
      t.ticket_description,
      s.status_name,
      p.priority_name,
      pr.project_key,
      pr.project_name,
      t.assignee_id,
      t.created_by,
      t.created_at,
      t.updated_at,
      a.username AS assignee_username,
      c.username AS reporter_username
    FROM Tickets t
    INNER JOIN Projects pr ON t.project_id = pr.project_id
    INNER JOIN TicketStatus s ON t.status_id = s.status_id
    INNER JOIN TicketPriority p ON t.priority_id = p.priority_id
    LEFT JOIN Users a ON t.assignee_id = a.user_id
    LEFT JOIN Users c ON t.created_by = c.user_id
    WHERE t.ticket_number = ? AND pr.project_key = ?
  `;

  const ticket = await executeQuery(query, [ticketNumber, projectKey]);

  if (!ticket || ticket.length === 0) {
    throw new Error("Ticket not found");
  }

  return ticket;
};

module.exports = { getBrowse };
