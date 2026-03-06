const express = require("express");
const { createJob, getJob, getJobs } = require("../controllers/jobController");

const router = express.Router()

router.get("/:jobId", getJob);
router.get("/", getJobs);
router.post("/", createJob)
router.patch("/:jobId", )

module.exports = router