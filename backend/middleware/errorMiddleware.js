const errorHandler = (err, req, res, next) => {
    // Log the full error on the server only
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    // Duplicate key (unique index)
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value already exists"
        });
    }

    // Mongoose schema validation
    if (err.name === "ValidationError" && err.errors) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: Object.values(err.errors).map((item) => item.message)
        });
    }

    // Invalid ObjectId or bad type cast
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid identifier"
        });
    }

    // Malformed JSON body
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in request body"
        });
    }

    const status = [err.statusCode, err.status].find(
        (code) => Number.isInteger(code) && code >= 400 && code < 600
    ) || 500;

    res.status(status).json({
        success: false,
        message: status === 500 ? "Internal server error" : err.message
    });
};

module.exports = errorHandler;
