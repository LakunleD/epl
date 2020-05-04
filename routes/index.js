const express = require('express');
const team = require('./team');
const result = require('./result');
const table = require('./table')

module.exports = function(app) {
    app.use(express.json());
    app.use("/teams", team);
    app.use("/results", result);
    app.use("/tables", table)
}