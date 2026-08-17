const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTgzMzVkZDljOTVmOGI0ZThlNGE4YjEiLCJpYXQiOjE3ODY5OTAzODEsImV4cCI6MTc4NzU5NTE4MX0.5w82g2JPyvvZXaZJ-BeTlvVi4qtsmece50Jug_Rx-k0