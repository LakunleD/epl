const express = require('express');
const team = require('./team');

module.exports = function(app) {
    app.use(express.json());
    app.use("/teams", team);
}