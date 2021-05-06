const mongoose = require('mongoose')
const Schema = mongoose.Schema

//User schema and model
const foodPostSchema = new Schema({
    user_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: [true, "Title is requiered"],
    },
    timePosted: {
        type: Date,
        default: Date.now
    },
    public: {
        type: Boolean,
        default: false
    },
    foodType: {
        type: String,
        required: [true, "Title is requiered"],
    },
    grams:{
        type: Number,
        required:[true,'You need to enter grams']
    },
    calories:{
        type: Number,
        required:[true,'You need to enter grams']
    },
    usersThatLikedPost:[{
        type:Schema.ObjectId,
        refs:'User'

    }]
 
   

})



const FoodPost = mongoose.model('FoodPost', foodPostSchema)

module.exports = FoodPost