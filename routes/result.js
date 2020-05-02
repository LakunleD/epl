const express = require('express');
const { createResult, viewResult } = require('../controllers/result')

const router = express.Router();

router
    .route('/')
    .post(createResult)

router
    .route('/:id')
    .get(viewResult)


module.exports = router;