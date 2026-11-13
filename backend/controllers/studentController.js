const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const LearningProgress = require("../models/LearningProgress");
const { registerStudent } = require("../services/authService");

const publicFields = "name email department role";

function toPublic(user) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role
    };
}

async function createStudent(req, res, next) {
    try {
        const student = await registerStudent(req.body);
        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student
        });
    } catch (error) {
        next(error);
    }
}

async function getStudent(req, res, next) {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: "student"
        })
            .select(publicFields)
            .lean();

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({ success: true, data: toPublic(student) });
    } catch (error) {
        next(error);
    }
}

async function updateStudent(req, res, next) {
    try {
        const updates = {};

        if (req.body.name !== undefined) {
            updates.name = req.body.name.trim();
        }
        if (req.body.email !== undefined) {
            updates.email = req.body.email.trim().toLowerCase();
        }
        if (req.body.department !== undefined) {
            updates.department = req.body.department.trim();
        }

        if (
            updates.email &&
            (await User.exists({
                email: updates.email,
                _id: { $ne: req.params.id }
            }))
        ) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const student = await User.findOneAndUpdate(
            { _id: req.params.id, role: "student" },
            { $set: updates },
            { new: true, runValidators: true }
        )
            .select(publicFields)
            .lean();

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: toPublic(student)
        });
    } catch (error) {
        next(error);
    }
}

async function deleteStudent(req, res, next) {
    try {
        const student = await User.findOneAndDelete({
            _id: req.params.id,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Remove dependent records so nothing is left orphaned
        await Promise.all([
            Enrollment.deleteMany({ student: student._id }),
            LearningProgress.deleteMany({ student: student._id })
        ]);

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent
};
