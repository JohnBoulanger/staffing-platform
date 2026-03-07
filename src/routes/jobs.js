const express = require("express");
const { getJobs, getJob, setNoShow, setInterest } = require("../controllers/jobController");
const jwtAuth = require("../middleware/auth");

const router = express.Router()

// express interest in a job posting
router.patch("/:jobId/interested", jwtAuth, setInterest);
// declare that the regular user did not show up to the job
router.patch("/:jobId/no-show", jwtAuth, setNoShow);
// see detail of a job
router.get("/:jobId", jwtAuth, getJob);
// retrieve a paginated list of open job postings
router.get("/", getJobs);

module.exports = router