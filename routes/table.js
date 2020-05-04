const express = require('express');
const { GetTable } = require('../controllers/table')

const router = express.Router();

router
    .route('/')
    .get(GetTable)

module.exports = router;