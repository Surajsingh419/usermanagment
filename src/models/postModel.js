const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'post title is required',
        unique:true
    },
    postCover: {
        type: String,
        required: 'post cover is required',
         unique:true
    },

    
    category: {
        type: String,
         required: 'post category is required'
    },
    
    isDeleted: {
        type: Boolean,
        default: false
    },
    
}, { timestamps: true })

module.exports = mongoose.model('post', postSchema)