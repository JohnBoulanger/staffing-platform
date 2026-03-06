const express = require("express");
const { registerUser, getUsers } = require("../controllers/userController")

const router = express.Router();

// register a new regular user account
router.post("/", registerUser);
router.get("/", getUsers);

module.exports = router