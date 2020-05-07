const { Table } = require('../models/table');

const GetTable = async(req, res) => {
    try {
        const table = await Table.find({})
                                    .populate('team_id', 'name');
        res.send({ success: true, table});
    }
    catch (error) {
        res.status(400).send({success: false})
    }
}

exports.GetTable = GetTable;