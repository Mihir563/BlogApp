const mongoose = require('mongoose');

const comment = mongoose.Schema({
    comment:{
        type:String,
    },
    UID: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    blogId:{
        type:String,
        required:true,
    },
    username: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Comment', comment);
