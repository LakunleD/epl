const mongoose = require("mongoose");
const joi = require('@hapi/joi');
const joigoose = require("joigoose")(mongoose);

const JoiTableSchema = joi.object({
    team_id: joi.string().meta({ _mongoose: { type: "ObjectId", ref: "Team" } }),
    match_played: joi.number().required(),
    wins: joi.number().required(),
    draws: joi.number().required(),
    loss: joi.number().required(),
    goal_scored: joi.number().required(),
    goal_against: joi.number().required()    
});

const ValidateTableDetails = (team_details) => JoiTeamSchema.validate(team_details);

const MongooseTableSchema = new mongoose.Schema(joigoose.convert(JoiTableSchema));

const Table = mongoose.model('Table', MongooseTableSchema);

exports.Table = Table;
exports.ValidateTableDetails = ValidateTableDetails;