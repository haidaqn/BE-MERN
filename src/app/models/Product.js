const mongoose = require('mongoose'); // Erase if already required

var productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            // unique: true,
            lowercase: true
        },
        description: {
            type: Array,
            required: true
        },
        brand: {
            type: String
        },

        price: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        images: {
            type: Array
        },
        thumb: {
            type: String,
            required: true
        },
        color: {
            type: String
        },
        ratings: [
            {
                star: { type: Number },
                postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
                comment: { type: String },
                updateAt: { type: Date }
            }
        ],
        totalRatings: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);
