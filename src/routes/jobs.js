const express = require("express");
const { createJob, getJob, getJobs } = require("../controllers/jobController");

const router = express.Router()

router.get("/:jobId", getJob);
router.get("/", getJobs);
router.post("/", createJob)

module.exports = router