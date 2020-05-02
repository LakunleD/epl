const mongoose = require('mongoose');

 const db = async () => {
    try {
        const conn = await mongoose.connect(process.env.EPL_MONGODB_URI,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
        console.log(`mongodb connected on ${conn.connection.host}`)
        return conn;
    }
    catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}

module.exports = db;