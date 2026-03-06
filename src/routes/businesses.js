const express = require("express");
const { registerBusiness, verifyBusiness, getBusiness, getBusinesses } = require("../controllers/businessController");

const router = express.Router()

// set the verified status of a business
router.patch("/:businessId/verified", verifyBusiness);
// retrieve a specific business
router.get("/:businessId", getBusiness);
// retrieve a list of businesses
router.get("/", getBusinesses);
// register a new business account
router.post("/", registerBusiness);

module.exports = router