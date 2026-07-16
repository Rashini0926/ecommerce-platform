const bcrypt = require("bcryptjs");
const { findUserByEmail } = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  loginUser,
};