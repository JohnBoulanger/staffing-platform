
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

module.exports = { getJobs };