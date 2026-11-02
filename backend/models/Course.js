const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, unique: true, trim: true },
    instructor: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    level: { type: String, trim: true, default: "Beginner" },
    category: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    status: { type: String, trim: true, default: "Active" },
    overview: { type: String, trim: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false }
  }
);

module.exports = mongoose.model("Course", courseSchema);