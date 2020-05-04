const { ValidateTeam, Team } = require('../models/team');
const { ValidateTableDetails, Table } = require('../models/table');

const createTeam = async(req, res) => {
    try{
        const { error } = await ValidateTeam(req.body);
        if (error) return res.status(400).send({ success:false, message: error.details[0].message });

        const team = new Team(req.body);
        await team.save();

        res.status(201).send({ success : true, team});

        let data = {
            team_id: team._id,
            match_played: 0,
            wins: 0,
            draws: 0,
            loss: 0,
            goal_scored: 0,
            goal_against: 0
        }

        const table = new Table(data);
        table.save();
    }
    catch(err){
        res.status(400).send({success: false})
    }
}

const GetAllTeams = async(req, res) => {
    try {
        const teams = await Team.find({});
        res.send({ success: true, teams });
    }
    catch (error) {
        res.status(400).send({success: false})
    }
}

const GetATeam = async(req, res) => {
    try {
        const team_id = req.params.id;
        const team = await Team.findById(team_id);
        res.send({ success: true, team });
    }
    catch (error) {
        res.status(400).send({success: false})
    }
}

exports.createTeam = createTeam;
exports.GetAllTeams = GetAllTeams;
exports.GetATeam = GetATeam;