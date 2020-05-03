const { Result, ValidateResult } = require('../models/result');

const createResult = async(req, res) => {
    try{
        req.body.date = Date.now()

        const { error } = await ValidateResult(req.body);
        if (error) return res.status(400).send({ success:false, message: error.details[0].message });

        const { home_id, away_id } = req.body;

        if (home_id == away_id) return res.status(400).send({ success:false, message: 'same team cannot play against each other' });

        const result = new Result(req.body);
        await result.save();

        res.status(201).send({ success : true, result });
    }
    catch(err){
        res.status(400).send({ success: false, message: err.message })
    }
}

const viewResult = async(req, res) => {
    try {
        const { id } = req.params;
        const { page, perPage } = req.query;
        
        const limit = parseInt(perPage, 10) || 10;
        const skip = page > 1 ? (page - 1) * limit  : 0 || 0

        const results = await Result.find({ $or: [{ home_id: id }, { away_id: id }]})
                                    .populate('home_id')
                                    .populate('away_id')
                                    .sort({ date: -1 })
                                    .limit(limit)
                                    .skip(skip)
        res.send({ success : true, results });
    }
    catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}

exports.createResult = createResult;
exports.viewResult = viewResult;