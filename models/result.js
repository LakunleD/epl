const mongoose = require('mongoose');
const joi = require('@hapi/joi');
const joigoose = require("joigoose")(mongoose, null, {
    _id: false,
    timestamps: false
});

const JoiResultSchema = joi.object({
    home_goal: joi.number().required(),
    away_goal: joi.number().required(),
    home_id: joi.string().meta({ _mongoose: { type: "ObjectId", ref: "Team" } }),
    away_id: joi.string().meta({ _mongoose: { type: "ObjectId", ref: "Team" } }),
    date: joi.date().required()
});

const ValidateResult = (result) => JoiResultSchema.validate(result);

const MongooseResultSchema = new mongoose.Schema(joigoose.convert(JoiResultSchema));

const Result = mongoose.model('Result', MongooseResultSchema);

exports.Result = Result;
exports.ValidateResult = ValidateResult;