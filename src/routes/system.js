const express = require("express");
const { setResetCooldown, setNegotiationWindow, setJobStartWindow, setAvailabilityTimeout } = require("../config/system");

const router = express.Router()

// update reset cooldown
router.patch("/reset-cooldown", (req, res) => {
    const reset_cooldown = parseInt(req.body.reset_cooldown);
    if (isNaN(reset_cooldown) || reset_cooldown < 0) {
        return res.status(400).json({ error: "Bad Request" });
    }
    setResetCooldown(reset_cooldown);
    return res.status(200).json({
        reset_cooldown
    });
});

// update negotiation window
router.patch("/negotiation-window", (req, res) => {
    const negotiation_window = parseInt(req.body.negotiation_window);
    if (isNaN(negotiation_window) || negotiation_window <= 0) {
        return res.status(400).json({ error: "Bad Request" });
    }
    setNegotiationWindow(negotiation_window);
    return res.status(200).json({
        negotiation_window
    });
});

// update job start window
router.patch("/job-start-window", (req, res) => {
    const job_start_window = parseInt(req.body.job_start_window);
    if (isNaN(job_start_window) || job_start_window <= 0) {
        return res.status(400).json({ error: "Bad Request" });
    }
    setJobStartWindow(job_start_window);
    return res.status(200).json({
        job_start_window
    });
});

// update availability timeout
router.patch("/availability-timeout", (req, res) => {
    const availability_timeout = parseInt(req.body.availability_timeout);
    if (isNaN(availability_timeout) || availability_timeout <= 0) {
        return res.status(400).json({ error: "Bad Request" });
    }
    setAvailabilityTimeout(availability_timeout);
    return res.status(200).json({
        availability_timeout
    });
});

// handle wrong methods
router.all("*", (req, res, next) => { 
    res.status(405).json({ error: "Method Not Allowed" }); 
});

module.exports = router