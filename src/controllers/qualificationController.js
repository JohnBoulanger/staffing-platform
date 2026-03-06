const { QualificationService } = require("../services/qualificationService")

async function createQualification(req, res) {
    try {
        const userId = req.user?.id;
        const response = await QualificationService.createQualification(req.body, userId);
        return res.status(201).json(response);
    }
    catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getQualifications(req, res) {
    try {
        const response = await QualificationService.getQualifications(req.query);
        return res.status(200).json(response);
    }
    catch (error) {
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

async function getQualification(req, res) {
    try {
        const requester = req.user;
        const qualificationId = parseInt(req.params.qualificationId);
        const response = await QualificationService.getQualification(qualificationId, requester);
        return res.status(200).json(response);
    }
    catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function updateQualification(req, res) {
    try {
        const requester = req.user;
        const qualificationId = parseInt(req.params.qualificationId);
        const response = await QualificationService.updateQualification(req.body, qualificationId, requester);
        return res.status(200).json(response);
    }
    catch (error) {
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

module.exports = { createQualification, getQualification, updateQualification, getQualifications };