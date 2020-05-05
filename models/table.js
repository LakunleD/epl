const mongoose = require("mongoose");
const joi = require('@hapi/joi');
const joigoose = require("joigoose")(mongoose);

const JoiTableSchema = joi.object({
    team_id: joi.string().meta({ _mongoose: { type: "ObjectId", ref: "Team" } }),
    wins: joi.number().required(),
    draws: joi.number().required(),
    loss: joi.number().required(),
    goal_scored: joi.number().required(),
    goal_against: joi.number().required()
});

const options = {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
};

const ValidateTableDetails = (team_details) => JoiTeamSchema.validate(team_details);

const MongooseTableSchema = new mongoose.Schema(joigoose.convert(JoiTableSchema), options);

MongooseTableSchema.virtual('match_played').get((value, virtual, doc)  => {
    return doc.wins + doc.draws + doc.loss;
});

MongooseTableSchema.virtual('points').get((value, virtual, doc)  => {
    return (doc.wins * 3) + doc.draws;
});

MongooseTableSchema.virtual('goal_difference').get((value, virtual, doc)  => {
    return doc.goal_scored - doc.goal_against;
});

const Table = mongoose.model('Table', MongooseTableSchema);

exports.Table = Table;
exports.ValidateTableDetails = ValidateTableDetails;