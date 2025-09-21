const { executeQuery } = require("../database/dbQuery");

const getUser = async () => {
  const query = "SELECT * FROM `users`";
  const response = await executeQuery(query, []);

  return response;
};
const setUser = async () => {};
const deleteUser = async () => {};

module.exports = { getUser, setUser, deleteUser };
