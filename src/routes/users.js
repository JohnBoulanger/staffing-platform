const express = require("express");
const { registerUser, getUsers, updateUserSuspend, getUser, updateUser, updateUserAvailability, uploadUserAvatar, uploadUserResume } = require("../controllers/userController");
const jwtAuth = require("../middleware/auth");
const { uploadAvatar, uploadResume } = require("../middleware/upload");

const router = express.Router();

// upload or replace avatar for authenticated user
router.put("/me/avatar", jwtAuth, uploadAvatar.single("file"), uploadUserAvatar);
// upload or replace resume for authenticated user
router.put("/me/resume", jwtAuth, uploadResume.single("file"), uploadUserResume);
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