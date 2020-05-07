const express = require('express');
const dotenv = require('dotenv');
const db = require('./startup/db');
const routes = require('./routes/index');

dotenv.config();
const app = express();

app.use(express.json());
routes(app);
db();

const port = process.env.PORT;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;