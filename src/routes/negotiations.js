const express = require("express");
const jwtAuth = require("../middleware/auth");

const { createNegotiation, getNegotiations, setDecision } = require("../controllers/negotiationController");

const router = express.Router();

// start a negotiation for a job
router.post("/", createNegotiation);
// retrieve the authenticated users' current negotiation
router.get("/me", jwtAuth, getNegotiations);
// set the authenticated party's decision for an active negotiation
router.patch("/me/decision", jwtAuth, setDecision);

module.exports = router;