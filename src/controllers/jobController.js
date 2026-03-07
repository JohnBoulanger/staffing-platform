
const { JobService } = require("../services/jobService");

async function getJobs(req, res) {
    try {
        const jobs = await JobService.getJobs(req.query);
        return res.status(200).json(jobs);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getJob(req, res) {
    try {
        const jobId = parseInt(req.params.jobId);
        const user = req.user;
        const job = await JobService.getJob(req.query, jobId, user);
        return res.status(200).json(job);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "forbidden") {
            return res.status(403).json({ error: "Forbidden" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function setNoShow(req, res) {
    try {
        const jobId = parseInt(req.params.jobId);
        if (isNaN(jobId)) {
            return res.status(400).json({ error: "Bad Request" });
        }
        const response = await JobService.setNoShow(req.body, jobId);
        return res.status(200).json(response);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        if (error.type === "conflict") {
            return res.status(409).json({ error: "Conflict" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function setInterest(req, res) {
    try {
        const jobId = parseInt(req.params.jobId);
        if (isNaN(jobId)) {
            return res.status(400).json({ error: "Bad Request" });
        }
        const response = await JobService.setInterest(req.body, jobId);
        return res.status(200).json(response);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
                if (error.type === "forbidden") {
            return res.status(403).json({ error: "Forbidden" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        if (error.type === "conflict") {
            return res.status(409).json({ error: "Conflict" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getJobs, getJob, setInterest, setNoShow };