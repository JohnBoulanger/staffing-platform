const { PositionTypeService } = require("../services/positionTypeService");

async function createPositionType(req, res) {
    try {
        const positionType = await PositionTypeService.createPositionType(req.body);
        return res.status(201).json(positionType);
    }
    catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        return res.status(500).json({ error: "Internal Server Error" }); 
    }
}

module.exports = { createPositionType };