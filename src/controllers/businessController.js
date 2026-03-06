const { BusinessService } = require("../services/businessService");

async function registerBusiness(req, res) {
    try {
        const business = await BusinessService.registerBusiness(req.body);
        return res.status(201).json(business);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "conflict") {
            return res.status(409).json({ error: "Conflict" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function verifyBusiness(req, res) {
    try {
        const businessId = parseInt(req.params.businessId);
        const response = await BusinessService.verifyBusiness(req.body, businessId);
        return res.status(200).json(response);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getBusiness(req, res) {
    try {
        const businessId = parseInt(req.params.businessId);
        const requesterRole = req.user?.role;
        const response = await BusinessService.getBusiness(businessId, requesterRole);
        return res.status(200).json(response);
    } catch (error) {
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getBusinesses(req, res) {
    try {
        const requesterRole = req.user?.role;
        const response = await BusinessService.getBusinesses(req.query, requesterRole);
        return res.status(200).json(response);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = { registerBusiness, verifyBusiness, getBusiness, getBusinesses }