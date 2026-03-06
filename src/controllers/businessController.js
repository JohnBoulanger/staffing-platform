const { createBusiness } = require("../services/businessService");

async function registerBusiness(req, res) {
    try {
        const business = await createBusiness(req.body);
        return res.status(201).json(business);
    } catch (err) {
        if (err.type === "validation") {
            return res.status(400).json({ error: err.message });
        }
        if (err.type === "conflict") {
            return res.status(409).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { registerBusiness }