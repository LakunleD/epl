const express = require('express');
const team = require('./team');
const result = require('./result');

module.exports = function(app) {
    app.use(express.json());
    app.use("/teams", team);
    app.use("/results", result);
}