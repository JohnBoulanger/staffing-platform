const express = require("express");
const { registerUser, getUsers, updateUserSuspend, getUser, updateUser, updateUserAvailability, uploadUserAvatar, uploadUserResume, getInvitations, getInterests } = require("../controllers/userController");
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
// retrieve a list of job invitations for the authenticated regular user.
// each invitation represents a job posting where a business has invited the user to express interest
router.get("/me/invitations", jwtAuth, getInvitations);
// retrieve a list of job postings that the authenticated regular user is currently interested in
router.get("/me/interests", jwtAuth, getInterests)
// retrieve the authenticated users account profile
router.get("/me", jwtAuth, getUser);
// update fields on the authenticated regular user's account profile
router.patch("/me", jwtAuth, updateUser);
// register a new regular user account
router.post("/", registerUser);
// retrieve a list of regular users
router.get("/", getUsers);

module.exports = router