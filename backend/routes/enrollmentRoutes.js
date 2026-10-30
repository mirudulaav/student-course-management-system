const express = require('express');
const { randomUUID } = require('crypto');
const authMiddleware = require('../middleware/authMiddleware');
const enrollments = require('../data/enrollments');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    const studentEnrollments = enrollments.filter(
        enrollment => String(enrollment.studentId) === String(req.user.id)
    );
    res.status(200).json(studentEnrollments);
});

router.post('/', authMiddleware, (req, res) => {
    const { studentId, courseId } = req.body || {};

    if (
        (typeof studentId !== 'string' && typeof studentId !== 'number') ||
        !String(studentId).trim() ||
        (typeof courseId !== 'string' && typeof courseId !== 'number') ||
        !String(courseId).trim()
    ) {
        return res.status(400).json({
            success: false,
            message: 'Student ID and course ID are required'
        });
    }

    if (String(studentId) !== String(req.user.id)) {
        return res.status(403).json({
            success: false,
            message: 'Students can only enroll themselves'
        });
    }

    const existingEnrollment = enrollments.find(
        enrollment =>
            String(enrollment.studentId) === String(studentId) &&
            String(enrollment.courseId) === String(courseId)
    );

    if (existingEnrollment) {
        return res.status(409).json({
            success: false,
            message: 'Student is already enrolled in this course'
        });
    }

    const enrollment = {
        id: randomUUID(),
        studentId: String(studentId),
        courseId: String(courseId),
        status: 'Enrolled',
        progress: 0
    };

    enrollments.push(enrollment);
    res.status(201).json(enrollment);
});

module.exports = router;