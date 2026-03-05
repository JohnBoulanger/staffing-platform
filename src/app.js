'use strict';

const express = require("express");
const authRoutes = require("./routes/auth");

function create_app() {
    const app = express();

    app.use(express.json());
    app.use("/auth", authRoutes)

    return app;
}

module.exports = { create_app };