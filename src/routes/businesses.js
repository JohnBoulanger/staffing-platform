const express = require("express");
const { registerBusiness, verifyBusiness, getBusiness, getBusinesses, getMyBusiness, updateMyBusiness, uploadBusinessAvatar, createJob, getJobs, updateJob, deleteJob } = require("../controllers/businessController");
const jwtAuth = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/upload");

const router = express.Router()

// edit an existing job
router.patch("/me/jobs/:jobId", jwtAuth, updateJob);
// delete an open or expired job posting
router.delete("/me/jobs/:jobId", jwtAuth, deleteJob);
// create a new job posting owned by the authenticated business
router.post("/me/jobs", jwtAuth, createJob);
// get a paginated list of jobs created by the currently logged in business.
router.get("/me/jobs", jwtAuth, getJobs);
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
// handle wrong methods
router.all("*", (req, res, next) => { 
    res.status(405).json({ error: "Method Not Allowed" }); 
});

module.exports = router