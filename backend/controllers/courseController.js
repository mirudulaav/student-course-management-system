
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../services/courseService");

const getCourses = async (req, res, next) => {
    try {
        const courses = await getAllCourses();
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        next(error);
    }
};

const getCourse = async (req, res, next) => {
    try {
        const course = await getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

const addCourse = async (req, res, next) => {
    try {
        const newCourse = await createCourse(req.body);
        res.status(201).json({ success: true, message: "Course created successfully", data: newCourse });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A course with this code already exists"
            });
        }
        next(error);
    }
};

const editCourse = async (req, res, next) => {
    try {
        const updatedCourse = await updateCourse(req.params.id, req.body);
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({ success: true, message: "Course updated successfully", data: updatedCourse });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A course with this code already exists"
            });
        }
        next(error);
    }
};

const removeCourse = async (req, res, next) => {
    try {
        const deleted = await deleteCourse(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCourses,
    getCourse,
    addCourse,
    editCourse,
    removeCourse
};
