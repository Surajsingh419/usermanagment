const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss'],
        required: 'Title is required',
    },
    name: {
        type: String,
        required: 'First name is required',
        
    },
    phone: {
        type: Number,
        unique: true,
        required: 'Mobile number is required',
        validate: function (phone) {
            return /^\d{10}$/.test(phone)
        }, message: 'Please fill a valid phone number'
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)