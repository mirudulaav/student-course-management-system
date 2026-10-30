const requiredFields = [
    "courseName",
    "courseCode",
    "instructor",
    "duration",
    "category"
];
const allowedFields = new Set([
    ...requiredFields,
    "level",
    "image",
    "status",
    "overview"
]);

function isValidCourseField(field, value) {
    if (!allowedFields.has(field)) return false;
    if (field === "duration" && Number.isFinite(value)) return value > 0;
    return typeof value === "string" && value.trim().length > 0;
}

function validateCourse(req, res, next) {
    const course = req.body;

    if (
        !course ||
        typeof course !== "object" ||
        Array.isArray(course) ||
        [...requiredFields].some(
            field => !isValidCourseField(field, course[field])
        ) ||
        Object.keys(course).some(field => !isValidCourseField(field, course[field]))
    ) {
        return res.status(400).json({
            success: false,
            message: "Provide valid course name, code, instructor, duration, and category"
        });
    }

    next();
}

function validateCoursePatch(req, res, next) {
    const course = req.body;
    const fields = course && typeof course === "object" && !Array.isArray(course)
        ? Object.keys(course)
        : [];

    if (
        fields.length === 0 ||
        fields.some(field => !isValidCourseField(field, course[field]))
    ) {
        return res.status(400).json({
            success: false,
            message: "Provide one or more valid course fields to update"
        });
    }

    next();
}

module.exports = { validateCourse, validateCoursePatch };
