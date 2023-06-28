module.exports = {
    mutipleMongooseToObject: mongooseArr => mongooseArr.map(mongoose => mongoose.toObject()),
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
};