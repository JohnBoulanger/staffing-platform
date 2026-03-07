const express = require("express");
const { getJobs, getJob, setNoShow, setInterest, getCandidates, getUserCandidates, updateInterestInCandidate, getInterests } = require("../controllers/jobController");
const jwtAuth = require("../middleware/auth");

const router = express.Router()

// list all discoverable qualified regular users for this job, and whether each has been invited by the business for this job.
router.get("/:jobId/candidates", jwtAuth, getCandidates);
// retrieve summary details about a regular user and their qualification for a given job.
router.get("/:jobId/candidates/:userId", jwtAuth, getUserCandidates);
// invite (or withdraw an invitation for) a regular user to express interest in this job posting.
router.patch("/:jobId/candidates/:userId/interested", jwtAuth, updateInterestInCandidate);
// retrieve a list of regular users who are currently interested in this job posting.
router.get("/:jobId/interests", jwtAuth, getInterests);
// express interest in a job posting
router.patch("/:jobId/interested", jwtAuth, setInterest);
// declare that the regular user did not show up to the job
router.patch("/:jobId/no-show", jwtAuth, setNoShow);
// see detail of a job
router.get("/:jobId", jwtAuth, getJob);
// retrieve a paginated list of open job postings
router.get("/", getJobs);

module.exports = router