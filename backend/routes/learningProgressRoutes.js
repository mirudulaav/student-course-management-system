const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
    res.status(200).json({ success: true, message: "Learning progress endpoint is active" });
});

module.exports = router;