const { Result, ValidateResult } = require('../models/result');

const { Table } = require('../models/table')

const createResult = async(req, res) => {
    try{
        req.body.date = Date.now()

        const { error } = await ValidateResult(req.body);
        if (error) return res.status(400).send({ success:false, message: error.details[0].message });

        const { home_id, away_id, home_goal, away_goal } = req.body;

        if (home_id == away_id) return res.status(400).send({ success:false, message: 'same team cannot play against each other' });

        if (home_goal > away_goal){
            const result = new Result(req.body);
            await result.save();

            await Table.updateOne({ team_id: home_id }, { $inc: { wins: 1, goal_scored: home_goal, goal_against: away_goal }});
            await Table.updateOne({ team_id: away_id }, { $inc: { loss: 1, goal_scored: away_goal, goal_against: home_goal }});

            return res.status(201).send({ success : true, result });
            
        }
        else if (home_goal < away_goal){
            const result = new Result(req.body);
            await result.save();
            
            await Table.updateOne({ team_id: home_id }, { $inc: { loss: 1, goal_scored: home_goal, goal_against: away_goal }});
            await Table.updateOne({ team_id: away_id }, { $inc: { wins: 1, goal_scored: away_goal, goal_against: home_goal }});
            
            return res.status(201).send({ success : true, result });
        }
        else{
            const result = new Result(req.body);
            await result.save();

            await Table.updateOne({ team_id: home_id }, { $inc: { draws: 1, goal_scored: home_goal, goal_against: away_goal }});
            await Table.updateOne({ team_id: away_id }, { $inc: { draws: 1, goal_scored: away_goal, goal_against: home_goal }});

            return res.status(201).send({ success : true, result });
        }
    }
    catch(err){
        res.status(400).send({ success: false, message: err.message });
    }
}

const viewResult = async(req, res) => {
    try {
        const { id } = req.params;
        const { page, perPage } = req.query;
        
        const limit = parseInt(perPage, 10) || 10;
        const skip = page > 1 ? (page - 1) * limit  : 0 || 0;

        const options = { $or: [{ home_id: id }, { away_id: id }]};

        const total = await Result.countDocuments(options);

        if (total === 0) return res.status(400).send({ success: true, message: "no matches found for this team" });

        if (total <= skip) return res.status(400).send({ success: false, message: "total number of documents exceeded", total });
        
        const results = await Result.find(options)
                                    .populate('home_id')
                                    .populate('away_id')
                                    .sort({ date: -1 })
                                    .limit(limit)
                                    .skip(skip)
        res.send({ success : true, results, total });
    }
    catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

exports.createResult = createResult;
exports.viewResult = viewResult;