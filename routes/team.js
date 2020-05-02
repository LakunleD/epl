const express = require('express');
const { createTeam, GetAllTeams, GetATeam } = require('../controllers/team')

const router = express.Router();

router
    .route('/')
    .post(createTeam)
    .get(GetAllTeams)


router
    .route('/:id')
    .get(GetATeam)


module.exports = router;