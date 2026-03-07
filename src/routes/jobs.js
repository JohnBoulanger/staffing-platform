const express = require("express");
const { getJobs } = require("../controllers/jobController");

const router = express.Router()

router.get("/:jobId/interested");
router.patch("/:jobId/no-show");
// retrieve a paginated list of open job postings
router.get("/", getJobs);

module.exports = router