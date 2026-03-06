const express = require("express");
const { registerBusiness } = require("../controllers/businessController");

const router = express.Router()

// register a new business account
router.post("/", registerBusiness);

module.exports = router