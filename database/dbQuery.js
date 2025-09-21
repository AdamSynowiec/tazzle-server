const pool = require("../database/dbConfig.js");

const executeQuery = async (query, params = []) => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error("Błąd zapytania do bazy danych:", error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { executeQuery };
