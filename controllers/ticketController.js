const { executeQuery } = require("../database/dbQuery");

// Pobranie ticketów
const getTicket = async () => {
  const query = `
    SELECT 
      t.ticket_id,
      t.ticket_number,
      t.ticket_title,
      t.ticket_description,
      s.status_name,
      pr.project_key,
      pr.project_name,
      p.priority_name,
      t.assignee_id,
      t.created_by
    FROM Tickets t
    INNER JOIN Projects pr ON t.project_id = pr.project_id
    INNER JOIN TicketStatus s ON t.status_id = s.status_id
    INNER JOIN TicketPriority p ON t.priority_id = p.priority_id
    WHERE t.is_deleted = FALSE
  `;
  const tickets = await executeQuery(query, []);
  return tickets;
};

// Utworzenie ticketu
const setTicket = async (req, res) => {
  const {
    project,
    issueType,
    priority,
    summary,
    description,
    assignee,
    reporter,
  } = req.body;

  // Pobranie ostatniego numeru ticketu dla projektu
  const lastTicket = await executeQuery(
    `SELECT ticket_number FROM Tickets WHERE project_id = ? ORDER BY ticket_number DESC LIMIT 1`,
    [project]
  );

  const ticketNumber =
    lastTicket.length > 0 ? lastTicket[0].ticket_number + 1 : 1;

  // Pobranie id statusu "Open"
  const status = await executeQuery(
    `SELECT status_id FROM TicketStatus WHERE status_name = 'Open' LIMIT 1`
  );
  const statusId = status[0]?.status_id || 1; // fallback

  // Pobranie id priorytetu
  const priorityRes = await executeQuery(
    `SELECT priority_id FROM TicketPriority WHERE priority_name = ? LIMIT 1`,
    [priority]
  );
  const priorityId = priorityRes[0]?.priority_id || 1;

  const createTicket = await executeQuery(
    `INSERT INTO Tickets(ticket_number, ticket_title, ticket_description, status_id, priority_id, project_id, assignee_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ticketNumber,
      summary,
      description,
      statusId,
      priorityId,
      project,
      assignee,
      reporter,
    ]
  );

  return createTicket;
};

const updateTicketStatus = async (ticketId, statusName) => {
  // Pobierz ID statusu po nazwie
  const statusRes = await executeQuery(
    "SELECT status_id FROM TicketStatus WHERE status_name = ? LIMIT 1",
    [statusName]
  );
  if (!statusRes.length) throw new Error("Status not found");
  const statusId = statusRes[0].status_id;

  // Aktualizacja ticketu
  await executeQuery(
    "UPDATE Tickets SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = ?",
    [statusId, ticketId]
  );

  return { ticketId, statusName };
};

const deleteTicket = async () => {};

module.exports = { getTicket, setTicket, deleteTicket, updateTicketStatus };
