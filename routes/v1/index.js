const express = require("express");
const {
  getProject,
  setProject,
  deleteProject,
} = require("../../controllers/projectController");
const { getUser } = require("../../controllers/userController");
const { getTicket, setTicket } = require("../../controllers/ticketController");
const { getBrowse } = require("../../controllers/browseController");
const {
  getComment,
  setComment,
} = require("../../controllers/commentController");
const router = express.Router();

const sendResponse = (
  res,
  statusCode,
  data = null,
  message = "",
  errors = null,
  meta = null
) => {
  res.status(statusCode).json({
    status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
    code: statusCode,
    message: message,
    data: data,
    errors: errors,
    meta: meta || { timestamp: new Date().toISOString() },
  });
};

// Test
router.get("/test", async (req, res) => {
  sendResponse(res, 200, {}, "OK");
});

// Projects
router.get("/projects", async (req, res) => {
  try {
    const rows = await getProject();
    sendResponse(res, 200, rows, "Projects fetched successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, "Failed to fetch projects");
  }
});

router.post("/projects", async (req, res) => {
  try {
    const result = await setProject(req.body);
    sendResponse(res, 201, result, "Project created successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, error.message || "Failed to create project");
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    const result = await deleteProject(req.params.id);
    sendResponse(res, 200, result, "Project deleted successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, error.message || "Failed to delete project");
  }
});

// Users
router.get("/users", async (req, res) => {
  try {
    const response = await getUser();
    sendResponse(res, 200, response, "Users fetched successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, "Failed to fetch users");
  }
});

// Tickets
router.get("/ticket", async (req, res) => {
  try {
    const response = await getTicket(req);
    sendResponse(res, 200, response, "Ticket fetched successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, "Failed to fetch ticket");
  }
});

router.post("/ticket", async (req, res) => {
  try {
    const response = await setTicket(req);
    sendResponse(res, 200, response, "Ticket created/updated successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, "Failed to create/update ticket");
  }
});

// Aktualizacja statusu ticketu
router.patch("/ticket/:id/status", async (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;

  try {
    const statusRes = await executeQuery(
      "SELECT status_id FROM TicketStatus WHERE status_name = ? LIMIT 1",
      [status]
    );

    if (!statusRes.length) {
      return res.status(400).json({ status: "error", message: "Status not found" });
    }

    const statusId = statusRes[0].status_id;

    await executeQuery(
      "UPDATE Tickets SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = ?",
      [statusId, ticketId]
    );

    res.status(200).json({ status: "success", message: "Status updated", data: { ticketId, status } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});


// Browse
router.get("/browse/:id", async (req, res) => {
  try {
    const response = await getBrowse(req);
    sendResponse(res, 200, response, "Ticket fetched successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, error.message);
  }
});

// GET komentarzy
router.get("/comment/:id", async (req, res) => {
  try {
    const response = await getComment(req);
    sendResponse(res, 200, response, "Comments fetched successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, error.message);
  }
});

// POST komentarza
router.post("/comment", async (req, res) => {
  try {
    const response = await setComment(req);
    sendResponse(res, 201, response, "Comment added successfully");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {}, error.message);
  }
});

module.exports = router;
