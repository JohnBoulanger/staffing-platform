const express = require("express");
const { createPositionType, updatePositionType, deletePositionType, getPositionTypes } = require("../controllers/positionTypeController")

const router = express.Router();

// create a new position type
router.post("/", createPositionType);
// edit a position types details
router.patch("/:positionTypeId", updatePositionType);
// delete a position type
router.delete("/:positionTypeId", deletePositionType);
// retrieve a list of position types
router.get("/", getPositionTypes);
// handle wrong methods
router.all("*", (req, res, next) => { 
    res.status(405).json({ error: "Method Not Allowed" }); 
});


module.exports = router