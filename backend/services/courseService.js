
const mongoose = require("mongoose");
const Course = require("../models/Course");

const getAllCourses = () => Course.find().sort({ createdAt: 1 });

const getCourseById = async (id) => {
    if (!mongoose.isValidObjectId(id)) return null;
    return Course.findById(id);
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
