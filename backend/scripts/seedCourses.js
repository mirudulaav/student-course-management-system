require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const Course = require("../models/Course");
const oldCourses = require("../data/courses");

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    if ((await Course.countDocuments()) > 0) {
      console.log("Courses already exist. Seeding skipped.");
      return;
    }

    const docs = oldCourses.map(({ id, ...course }) => course);
    await Course.insertMany(docs);
    console.log(`Seeded ${docs.length} courses`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCourses();