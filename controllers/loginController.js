const { executeQuery } = require("../database/dbQuery");

const login = async (req) => {
  const { email, password } = req.query;

  if (!email || !password) {
    throw new Error("Brak emaila lub hasła");
  }

  // 🔹 proste sprawdzenie użytkownika
  const users = await executeQuery(
    `SELECT user_id, username, email, role_id, is_active
     FROM Users
     WHERE email = ? AND password = ?`,
    [email, password]
  );

  if (users.length === 0) {
    throw new Error("Nieprawidłowy email lub hasło");
  }

  // 🔹 można dodać aktualizację ostatniego logowania
  await executeQuery(`UPDATE Users SET last_login = NOW() WHERE user_id = ?`, [
    users[0].user_id,
  ]);

  return users[0];
};

module.exports = { login };
