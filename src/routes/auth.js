const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const router = express.Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// authenticate an acocunt holder and generate a JWT token
router.post("/tokens", async (req, res) => {

    try {
        const { email, password } = req.body;

        // didnt provide email or password
        if (!email || !password) {
            return res.status(400).json({ error: "Bad Request" });
        }

        // find account
        const account = await prisma.account.findUnique({
            where: { 
                email: email,
            }
        });

        // account not authorized or not activated
        if (!account) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!account.activated) {
            return res.status(403).json({ error: "Account Not Activated" });
        }
        const match = await bcrypt.compare(password, account.password);
        if (!match) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        // generate JWT for the account (payload, secret, options)
        const token = jwt.sign(
            {
                accountId: account.id,
                role: account.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 1);

        return res.status(200).json({ token: token, expiresAt: expiryDate})
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    
});

module.exports = router;