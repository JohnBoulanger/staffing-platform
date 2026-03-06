const express = require("express");
const { registerUser, getUsers, updateUserSuspend } = require("../controllers/userController")

const router = express.Router();

// set the suspended status of a regular user
router.patch("/:userId/suspended", updateUserSuspend);
// register a new regular user account
router.post("/", registerUser);
// retrieve a list of regular users
router.get("/", getUsers);


module.exports = router