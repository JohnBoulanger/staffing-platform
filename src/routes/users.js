const express = require("express");
const { isValidEmail, isValidPassword } = require("../helpers/validation");
const encodePassword = require("../helpers/encodePassword")

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

// register a new regular user account
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, phone_number, postal_address, birthday } = req.body;

    // check valid body
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Bad Request" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid Email" });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ error: "Invalid Password" });
    }

    const encPass = await encodePassword(password);

    try {
        const existingUser = await prisma.account.findUnique({
            where: { email: email }
        });

        // check if a user already exists in the database
        if (existingUser) {
            return res.status(409).json({ error: "Conflict: User Already Exists" });
        }

        // create a new account and regular user
        const account = await prisma.account.create({
            data: {
                email: email,
                password: encPass,
                role: "regular",
                activated: true
            }
        })

        const user = await prisma.regularUser.create({
            data: {
                accountId: account.id, 
                first_name,
                last_name,
                phone_number,
                postal_address,
                birthday: birthday ? new Date(birthday) : new Date("1970-01-01")
            }
        })

        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router