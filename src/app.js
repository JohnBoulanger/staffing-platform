'use strict';

const express = require("express");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users")
const businessRoutes = require("./routes/businesses")

function create_app() {
    const app = express();

    app.use(express.json());
    app.use("/auth", authRoutes);
    app.use("/users", userRoutes);
    app.use("/businesses", businessRoutes);

    return app;
}

module.exports = { create_app };