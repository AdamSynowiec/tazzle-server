const { executeQuery } = require("../database/dbQuery");

// Pobranie wszystkich projektów
const getProject = async () => {
  const query = "SELECT * FROM Projects"; // Używamy poprawnej nazwy tabeli
  const rows = await executeQuery(query, []);
  return rows;
};

// Dodanie nowego projektu
const setProject = async (body) => {
  const project_key = body.ProjectKey || body.project_key;
  const project_name = body.ProjectName || body.project_name;
  const project_description = body.description || body.project_description;
  const owner_id = body.owner_id || 1; // fallback testowy
  const created_by = body.created_by || 1;

  if (!project_key || !project_name) {
    throw new Error("Missing required fields");
  }

  const query = `
    INSERT INTO Projects (owner_id, project_key, project_name, project_description, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;

  const result = await executeQuery(query, [
    owner_id,
    project_key,
    project_name,
    project_description || null,
    created_by,
  ]);

  return { projectId: result.insertId };
};

// Usuwanie projektu
const deleteProject = async (id) => {
  const query = "DELETE FROM Projects WHERE project_id = ?";
  const result = await executeQuery(query, [id]);

  if (result.affectedRows === 0) {
    throw new Error("Project not found");
  }

  return { message: "Project deleted" };
};

module.exports = { getProject, setProject, deleteProject };
