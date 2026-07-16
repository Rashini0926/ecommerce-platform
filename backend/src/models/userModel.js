const db = require("../config/db");

const createUser = async (user) => {
  const { full_name, email, phone, password, role } = user;

  const [result] = await db.execute(
    `INSERT INTO users (full_name, email, phone, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [full_name, email, phone, password, role]
  );

  return result;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};