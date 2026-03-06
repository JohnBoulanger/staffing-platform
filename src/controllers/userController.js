const { createUser, getUsersService } = require("../services/userService");

// register a new regular user account
async function registerUser(req, res) {
    try {
        const user = await createUser(req.body);
        return res.status(201).json(user);
    } catch (err) {
        if (err.type === "validation") {
            return res.status(400).json({ error: err.message });
        }
        if (err.type === "conflict") {
            return res.status(409).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// retrieve a list of regular users
async function getUsers(req, res) {
    try {
        const users = await getUsersService(req.query);
        return res.status(200).json(users);
    }
    catch (err) {
        if (err.type === "validation") {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { registerUser, getUsers };