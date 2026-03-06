const express = require("express");
const { createPositionType } = require("../controllers/positionTypeController")

const router = express.Router();

// create a new position type
router.post("/", createPositionType);

module.exports = router