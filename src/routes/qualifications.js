const express = require("express");
const router = express.Router();
const { createQualification, getQualifications, getQualification, updateQualification, uploadQualificationDocument } = require("../controllers/qualificationController");
const jwtAuth = require("../middleware/auth");
const { uploadDocument } = require("../middleware/upload");

// upload or replace document for authenticated user
router.put("/:qualificationId/document", jwtAuth, uploadDocument.single("file"), uploadQualificationDocument);
// retrieve a single qualification request
router.get("/:qualificationId", jwtAuth, getQualification);
// update a qualification request
router.patch("/:qualificationId", jwtAuth, updateQualification);
// retrieve a list of qualifications that need admin attention
router.get("/", getQualifications);
// create a new qualification for a position type
router.post("/", jwtAuth, createQualification);

module.exports = router;