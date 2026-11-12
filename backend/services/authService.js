const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function registerStudent({ name, email, password, department }) {
  const normalizedEmail = email.trim().toLowerCase();

  if (await User.exists({ email: normalizedEmail })) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    department: department.trim(),
    role: "student"
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role
  };
}

async function loginStudent({ email, password }) {
  const user = await User.findOne({
    email: email.trim().toLowerCase()
  }).select("+password").lean();

  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role
  };
}

module.exports = { registerStudent, loginStudent };