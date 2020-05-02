const express = require('express');
const dotenv = require('dotenv');
const db = require('./startup/db');

dotenv.config();
const app = express();

db();

const port = process.env.EPL_SERVER_PORT;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;