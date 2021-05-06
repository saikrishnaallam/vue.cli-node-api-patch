const mongoose = require('mongoose')
const Schema = mongoose.Schema


const friendSchema = new Schema({

    userOne: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    userTwo: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },

})


const Friend = mongoose.model('Friend', friendSchema)
module.exports = Friend