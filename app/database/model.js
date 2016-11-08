function createModel(mongoose) {
    const hotelSchema = mongoose.Schema({
        name: {
            type: String,
            minlength: 3,
            maxlength: 50
        },
        description: {
            type: String,
            maxlength: 250
        },
        rate: {
            type: Number,
            min: 1,
            max: 5
        }
    });

    const Hotel = mongoose.model('Hotel', hotelSchema);

    return {
        Hotel
    }
}

module.exports = createModel;