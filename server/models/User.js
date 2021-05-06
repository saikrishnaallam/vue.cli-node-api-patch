const mongoose = require('mongoose')
const Schema = mongoose.Schema

//User schema and model
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is requiered"],
        unique: true
    },
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: [true, "Email is requiered"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is requiered"]
    },
    role: {
        type: String,
        required: true,
        default:'USER'
    },
    weight:{
        type: Number,
        default:0
    },
    //users that this users follows not the other way around!
    followingUsers:[{
        type:Schema.ObjectId,
        refs:'User',
    }],
    imageUrl:{
        type:String,
        required:false,
    }


})



const User = mongoose.model('User', userSchema)



module.exports = User