const allowedFields = new Set(["name", "email", "department"]);

function validateStudentUpdate(requireAllFields) {
    return (req, res, next) => {
        const body = req.body;

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return res.status(400).json({
                success: false,
                message: "Student details must be provided as an object"
            });
        }

        const fields = Object.keys(body);
        if (
            fields.length === 0 ||
            fields.some(field => !allowedFields.has(field)) ||
            (requireAllFields &&
                [...allowedFields].some(field => typeof body[field] !== "string"))
        ) {
            return res.status(400).json({
                success: false,
                message: requireAllFields
                    ? "Name, email, and department are required"
                    : "Provide valid name, email, or department fields"
            });
        }

        if (
            fields.some(field =>
                typeof body[field] !== "string" || !body[field].trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Student details must be non-empty strings"
            });
        }

        if (
            body.email !== undefined &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email address"
            });
        }

        next();
    };
}

module.exports = validateStudentUpdate;
