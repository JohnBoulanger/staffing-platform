'use strict';

const express = require("express");

function create_app() {
    const app = express();
    app.use(express.json());

    // TODO: add routes here

    return app;
}

module.exports = { create_app };