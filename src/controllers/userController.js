const userModel = require('../models/userModel')

const jwt = require('jsonwebtoken')
const validator = require('email-validator');

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.length === 0) return false
    return true;
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidphone = function (value, type) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value != type) return false
    return true;
}
const isValidSyntaxOfEmail = function (value) {

    if (!(validator.validate(value))) {

        return false

    }

    return true

}

const registerUser = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
            return
        }

        // Extract params
        let { title, name, phone, email, password } = requestBody; // Object destructing

        // Validation starts

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Title is required' })
            return
        }
        

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: ' name is required' })
            return
        }

        if (!isValidphone(phone, 'number')) {
            res.status(400).send({ status: false, message: "phone number is required" })
            return
        }

        //mobile number validation

        if (!(/^\d{10}$/.test(phone))) {
            res.status(400).send({ status: false, message: `phone number  should be a valid` })
            return
        }

        const isphoneAlreadyUsed = await userModel.findOne({ phone })
        if (isphoneAlreadyUsed) {
            res.status(400).send({ status: false, message: `this phone number ${phone} is already used, try another one` })
            return
        }

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }
        if (!isValidSyntaxOfEmail(email)) {

            return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });

        }
        
         const isEmailAlreadyUsed = await userModel.findOne({ email }); 

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }


        if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }

        if (!isValidPassword(password)) {
            res.status(400).send({ status: false, message: `Password must contain characters between 8 to 15` })
            return
        }
         const userData = { title, name, phone, email, password }
        const newUser = await userModel.create(userData);

        res.status(201).send({ status: true, message: `user created successfully`, data: newUser });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}




const loginUser = async function (req, res) {

    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }

        // Extract params
        const { email, password } = requestBody;

        // Validation starts
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }

        

        if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        // Validation ends

        const user = await userModel.findOne({ email, password });

        if (!user) {
            res.status(401).send({ status: false, message: `Invalid login credentials` });
            return
        }

        const token = await jwt.sign({ userId: user._id }, 'radium', {

            expiresIn: "4h"

        })

        res.header('x-api-key', token);
        res.status(200).send({ status: true, message: `user login successfull`, data: { token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


module.exports = { registerUser, loginUser }
