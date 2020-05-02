const mongoose = require("mongoose");
const joi = require('@hapi/joi');
const joigoose = require("joigoose")(mongoose);

const JoiTeamSchema = joi.object({
    name: joi.string().min(4).required(),
    nickname: joi.string().min(4).required(),
    stadium: joi.string().min(6).required(),
    head_coach: joi.string().min(6).required()
});

const ValidateTeam = (team) => JoiTeamSchema.validate(team);

const MongooseTeamSchema = new mongoose.Schema(joigoose.convert(JoiTeamSchema));

const Team = mongoose.model('Team', MongooseTeamSchema);

exports.Team = Team;
exports.ValidateTeam = ValidateTeam;