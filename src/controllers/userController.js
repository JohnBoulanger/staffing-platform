const { UserService } = require("../services/userService");

// register a new regular user account
async function registerUser(req, res) {
    try {
        const user = await UserService.registerUser(req.body);
        return res.status(201).json(user);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "conflict") {
            return res.status(409).json({ error: "Conflict" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// retrieve a list of regular users
async function getUsers(req, res) {
    try {
        const users = await UserService.getUsers(req.query);
        return res.status(200).json(users);
    }
    catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// set the suspend status of a regular user
async function updateUserSuspend(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const response = await UserService.updateUserSuspend(req.body, userId);
        return res.status(200).json(response);
    }
    catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { registerUser, getUsers, updateUserSuspend };