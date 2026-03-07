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

// get specific user
async function getUser(req, res) {
    try {
        const userId = req.user.id;
        const user = await UserService.getUser(userId);
        return res.status(200).json(user);
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

// updated authenticated user
async function updateUser(req, res) {
    try {
        const userId = req.user.id;
        const user = await UserService.updateUser(req.body, userId);
        return res.status(200).json(user);
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

// update user availability
async function updateUserAvailability(req, res) {
    try {
        const userId = req.user.id;
        const user = await UserService.updateUserAvailability(req.body, userId);
        return res.status(200).json(user);
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

// upload or replace avatar for authenticated user
async function uploadUserAvatar(req, res) {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const avatarUrl = `/uploads/users/${userId}/${req.file.filename}`;
        const response = await UserService.uploadUserAvatar(avatarUrl, userId);
        return res.status(200).json(response);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// upload or replace resume for authenticated user
async function uploadUserResume(req, res) {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const resumeUrl = `/uploads/users/${userId}/${req.file.filename}`;
        const response = await UserService.uploadUserResume(resumeUrl, userId);
        return res.status(200).json(response);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        if (error.type === "not_found") {
            return res.status(404).json({ error: "Not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getInvitations(req, res) {
    try {
        const userId = req.user.id;
        const invitations = await UserService.getInvitations(req.query, userId);
        return res.status(200).json(invitations);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getInterests(req, res) {
    try {
        const userId = req.user.id;
        const interests = await UserService.getInterests(req.query, userId);
        return res.status(200).json(interests);
    } catch (error) {
        if (error.type === "validation") {
            return res.status(400).json({ error: "Bad Request" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { registerUser, getUsers, updateUserSuspend, getUser, updateUser, updateUserAvailability, uploadUserAvatar, uploadUserResume, getInvitations, getInterests };