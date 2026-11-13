const dns = require("dns");
const mongoose = require("mongoose");

// Local-only DNS workaround; hosting platforms resolve DNS themselves
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

let connectionPromise = null;

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  // Already connected: reuse it
  if (mongoose.connection.readyState === 1) return;

  // Share one in-flight connection between concurrent requests
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => console.log("MongoDB connected successfully"))
      .catch((error) => {
        connectionPromise = null; // allow a retry on the next request
        throw error;
      });
  }

  await connectionPromise;
}

module.exports = connectDB;