const express = require("express");
const { registerUser, getUsers, updateUserSuspend, getUser, updateUser, updateUserAvailability } = require("../controllers/userController");
const jwtAuth = require("../middleware/auth");

const router = express.Router();

// set the suspended status of a regular user
router.patch("/:userId/suspended", updateUserSuspend);
// update availability status of user
router.patch("/me/available", jwtAuth, updateUserAvailability);
// retrieve the authenticated users account profile
router.get("/me", jwtAuth, getUser);
// update fields on the authenticated regular user's account profile
router.patch("/me", jwtAuth, updateUser);
// register a new regular user account
router.post("/", registerUser);
// retrieve a list of regular users
router.get("/", getUsers);


module.exports = router