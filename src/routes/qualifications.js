const express = require("express");
const router = express.Router();
const { createQualification, getQualifications, getQualification, updateQualification } = require("../controllers/qualificationController");
const jwtAuth = require("../middleware/auth");

// retrieve a single qualification request
router.get("/:qualificationId", jwtAuth, getQualification);
// update a qualification request
router.patch("/:qualificationId", jwtAuth, updateQualification);
// retrieve a list of qualifications that need admin attention
router.get("/", getQualifications);
// create a new qualification for a position type
router.post("/", jwtAuth, createQualification);

module.exports = router;