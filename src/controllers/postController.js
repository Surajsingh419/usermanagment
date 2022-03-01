const mongoose = require('mongoose')
const postModel = require('../models/postModel')                                                                                                                                                                                                                                                                                                                                                                                                                      


const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.length === 0) return false
    return true;
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   d(objectId)
}                           
   
const createPost = async function (req, res) {                                                                                                                                                                    
    try {                                                                                                                                                                                                                                                              
        const requestBody = req.body;
        const userIdFromToken=req.userId

        if(!isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide book details'})
            return
        }

        if(!isValidObjectId(userIdFromToken)) {
            res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
            return
        }


        // Extract params
        const {title,postCover, category, releasedAt} = requestBody;
        
        // Validation starts

        if(!isValid(title)) {
            res.status(400).send({status: false, message: 'post Title is required'})
            return
        }

        const isTitleAlreadyUsed = await postModel.findOne({title}); 

        if(isTitleAlreadyUsed) {
            res.status(400).send({status: false, message: `${title} title is already registered`})
            return
        }
        if(!isValid(postCover)) {
            res.status(400).send({status: false, message: 'postcover is required'})
            return
        }

    

        //const user = await userModel.findById(userId);

        if(!user) {
            res.status(400).send({status: false, message: `user does not exit`})
            return
        }

        if(userId !==userIdFromToken) {
            res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
            return
        }

        if(!isValid(category)) {
            res.status(400).send({status: false, message: 'post category is required'})
            return
        }

          const postData = {
            title, 
            postCover,  
            category, 
            releasedAt
        }
    
        const createdpost = await postModel.create(postData)
        return res.status(201).send({status: true, message: 'New post created successfully', data: createdpost})
    } 
    catch (error) {
        console.log(error)
        res.status(500).send({status: false, message: error.message});
    }
}

const getPost = async function (req, res) {

    try {

        let search = await postModel.find()
           res.status(200).send({ status: true, message: "post list", data: search })

     } catch (error) {
           res.status(500).send({ status: false, error: error.message });

 }

}
module.exports={createPost, getPost}