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

module.exports = { registerBusiness }