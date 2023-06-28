const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.set('strictQuery', false),
            await mongoose.connect(`${process.env.MONGO_URL}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        console.log('connect successfully');
    } catch (err) {
        console.log('connect failure !!!');
        throw new Error(err);
    }
}

module.exports = { connect };
