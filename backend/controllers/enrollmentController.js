const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const LearningProgress = require("../models/LearningProgress");
const getPagination = require("../utils/pagination");
const serializeCourse = require("../utils/serializeCourse");

function flatten(enrollment, progressMap) {
  const key = `${enrollment.student}-${enrollment.course}`;
  return {
    id: String(enrollment._id),
    studentId: String(enrollment.student),
    courseId: String(enrollment.course),
    status: enrollment.status,
    enrolledAt: enrollment.enrolledAt,
    progress: progressMap.get(key) || 0
  };
}

async function enrollCourse(req, res, next) {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body || {};

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(401).json({ success: false, message: "Invalid student identity" });
    }
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, message: "Valid course ID is required" });
    }
    if (!(await Course.exists({ _id: courseId }))) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrollment = await Enrollment.create({ student: studentId, course: courseId });
    return res.status(201).json(flatten(enrollment, new Map()));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Already enrolled in this course" });
    }
    next(error);
  }
}

async function getEnrollments(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? {} : { student: req.user.id };
    const { page, limit, skip } = getPagination(req.query);
    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter).sort({ enrolledAt: -1 }).skip(skip).limit(limit).lean(),
      Enrollment.countDocuments(filter)
    ]);
    const progressFilter = enrollments.length
      ? {
          $or: enrollments.map(({ student, course }) => ({ student, course }))
        }
      : { _id: null };
    const progress = await LearningProgress.find(progressFilter).lean();

    const progressMap = new Map(
      progress.map((p) => [`${p.student}-${p.course}`, p.progressPercentage])
    );

    res.status(200).json({
      success: true,
      count: enrollments.length,
      total,
      page,
      limit,
      data: enrollments.map((enrollment) => flatten(enrollment, progressMap))
    });
  } catch (error) {
    next(error);
  }
}

async function getMyCourses(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { student: req.user.id };
    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter)
        .populate("course")
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enrollment.countDocuments(filter)
    ]);

    res.status(200).json({
      message: "Enrolled courses fetched successfully",
      totalEnrollments: total,
      page,
      limit,
      enrollments: enrollments.map((enrollment) => ({
        ...enrollment,
        course: serializeCourse(enrollment.course)
      }))
    });
  } catch (error) {
    next(error);
  }
}

async function unenrollCourse(req, res, next) {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid student or course ID" });
    }

    const removed = await Enrollment.findOneAndDelete({ student: studentId, course: courseId });
    if (!removed) {
      return res.status(404).json({ success: false, message: "You are not enrolled in this course" });
    }

    await LearningProgress.deleteOne({ student: studentId, course: courseId });
    res.status(200).json({ success: true, message: "Successfully unenrolled from course" });
  } catch (error) {
    next(error);
  }
}

module.exports = { enrollCourse, getEnrollments, getMyCourses, unenrollCourse };
