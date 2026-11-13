const dns = require("dns");

// Local-only DNS workaround; hosting platforms resolve DNS themselves
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}
const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully");
}

module.exports = connectDB;