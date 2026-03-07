const express = require("express");
const { registerBusiness, verifyBusiness, getBusiness, getBusinesses, getMyBusiness, updateMyBusiness, uploadBusinessAvatar } = require("../controllers/businessController");
const jwtAuth = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/upload");

const router = express.Router()
// upload or replace avatar for business
router.put("/me/avatar", jwtAuth, uploadAvatar.single("file"), uploadBusinessAvatar);
// retrieve the authenticated business profile
router.get("/me", jwtAuth, getMyBusiness);
// update fields on the authenticated business profile
router.patch("/me", jwtAuth, updateMyBusiness);
// set the verified status of a business
router.patch("/:businessId/verified", verifyBusiness);
// retrieve a specific business
router.get("/:businessId", getBusiness);
// retrieve a list of businesses
router.get("/", getBusinesses);
// register a new business account
router.post("/", registerBusiness);

module.exports = router