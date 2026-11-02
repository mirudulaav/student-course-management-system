const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

async function register(req, res, next) {
    try {
        const student = await authService.registerStudent(req.body);

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const student = await authService.loginStudent(req.body);

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

        // 1. Update this token generation to use student.role dynamically from MongoDB
        const token = jwt.sign(
        {
            email: student.email,
            role: student.role //hardcoded "student" to student.role
        },
        process.env.JWT_SECRET,
        {
            subject: String(student.id),
            expiresIn: expiresIn
        }
        );

        // 2. Cleaned up responses to have a single, clean return call
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            tokenType: "Bearer",
            expiresIn,
            student
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login };