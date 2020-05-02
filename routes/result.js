const express = require('express');
const { createResult } = require('../controllers/result')

const router = express.Router();

router
    .route('/')
    .post(createResult)


module.exports = router;