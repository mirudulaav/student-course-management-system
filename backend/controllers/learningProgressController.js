const mongoose = require("mongoose");
const LearningProgress = require("../models/LearningProgress");
const Enrollment = require("../models/Enrollment");

async function updateProgress(req, res, next) {
  try {
    const studentId = req.user.id;
    const { courseId, completedLessons, totalLessons } = req.body || {};

    if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: "Invalid student or course ID" });
    }
    if (
      !Number.isInteger(completedLessons) ||
      !Number.isInteger(totalLessons) ||
      totalLessons < 1 ||
      completedLessons < 0 ||
      completedLessons > totalLessons
    ) {
      return res.status(400).json({ message: "Invalid lesson progress values" });
    }

    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "You must be enrolled in this course" });
    }

    let progress = await LearningProgress.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = new LearningProgress({
        student: studentId,
        course: courseId,
        completedLessons,
        totalLessons
      });
    } else {
      progress.completedLessons = completedLessons;
      progress.totalLessons = totalLessons;
    }
    progress.lastAccessedAt = new Date();
    await progress.save();

    enrollment.status = progress.progressPercentage === 100 ? "completed" : "active";
    await enrollment.save();

    res.status(200).json({ message: "Learning progress updated successfully", progress });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Progress record already exists. Please retry." });
    }
    next(error);
  }
}

async function getMyProgress(req, res, next) {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).select("course");
    const courseIds = enrollments.map((e) => e.course);

    const progress = await LearningProgress.find({
      student: req.user.id,
      course: { $in: courseIds }
    })
      .populate("course", "courseName courseCode")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Learning progress fetched successfully",
      totalCourses: progress.length,
      progress
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { updateProgress, getMyProgress };