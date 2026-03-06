const express = require("express");
const { authenticateAccount, requestPasswordReset, useResetToken } = require("../controllers/authController");

const router = express.Router();

// authenticate the account holder and provide them with a jwt token they can use for future requests
router.post("/tokens", authenticateAccount);
// request a reset token that can later be used to activate the users account or reset their password
router.post("/resets", requestPasswordReset);
// use the reset token to activate their account or reset their password
router.post("/resets/:resetToken", useResetToken);

module.exports = router;