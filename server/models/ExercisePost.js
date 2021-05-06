const mongoose = require('mongoose')
const Schema = mongoose.Schema

//User schema and model
const exercisePostSchema = new Schema({
    user_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        required: [true, "Title is requiered"],
    },
    description: {
        type: String,
        required: [true, "Text is requiered"],
    },
    timePosted: {
        type: Date,
        default: Date.now
    },
    public: {
        type: Boolean,
        default: false
    },
    numberOfCaloriesBurned: {
        type: Number,
        required: [true, "Title is requiered"],
        default:0
    },
    length: {
        type: Number,
        required: [true, "Title is requiered"],
        default:0
    },
    timeUnit: {
        type: String,
        required: [true, "Title is requiered"],
        enum: ['Minutes', 'Hours', 'Seconds']
    },
    usersThatLikedPost:[{
        type:Schema.ObjectId,
        refs:'User',
    }]
   

})



const ExercisePost = mongoose.model('ExercisePost', exercisePostSchema)

module.exports = ExercisePost