const mongoose = require("mongoose");
const Joi = require('@hapi/joi');
const Joigoose = require("joigoose")(mongoose);

const JoiTeamSchema = Joi.object({
    name: Joi.string().min(4).required(),
    nickname: Joi.string().min(4).required(),
    stadium: Joi.string().min(6).required(),
    head_coach: Joi.string().min(6).required()
});

const ValidateTeam = (team) => JoiTeamSchema.validate(team);

const MongooseTeamSchema = new mongoose.Schema(Joigoose.convert(JoiTeamSchema));

const Team = mongoose.model('Team', MongooseTeamSchema);

exports.Team = Team;
exports.ValidateTeam = ValidateTeam;