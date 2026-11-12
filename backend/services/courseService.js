
const mongoose = require("mongoose");
const Course = require("../models/Course");
const serializeCourse = require("../utils/serializeCourse");

const getAllCourses = async ({ skip, limit }) => {
    const courses = await Course.find()
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
    return courses.map(serializeCourse);
};

const getCourseById = async (id) => {
    if (!mongoose.isValidObjectId(id)) return null;
    return serializeCourse(await Course.findById(id).lean());
};

const createCourse = (courseData) => Course.create(courseData);

const updateCourse = async (id, courseData) => {
    if (!mongoose.isValidObjectId(id)) return null;
    return Course.findByIdAndUpdate(id, courseData, {
        new: true,
        runValidators: true
    });
};

const deleteCourse = async (id) => {
    if (!mongoose.isValidObjectId(id)) return false;
    const deleted = await Course.findByIdAndDelete(id);
    return Boolean(deleted);
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};
