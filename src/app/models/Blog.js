const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        numberViews: { type: Number, default: 0 },
        likes: [
            {
                type: mongoose.Types.ObjectId,      
                ref: 'User'
            }
        ],
        disLiked: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ],
        image: {
            type: String,
            default:
                'https://assets-global.website-files.com/5b68224723db9d4df3f98c08/624976adfd71eb557431469a_Services%20Background.png'
        },
        author: {
            type: String,
            default: 'user'
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);
