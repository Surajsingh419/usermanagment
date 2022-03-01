const express = require('express');

const router = express.Router();
const awsController= require('../controllers/awsController')
const userController = require('../controllers/userController');
const postController=require('../controllers/postController')

const midd=require('../middleWare/middleWare')

// to create postCover url
router.post("/postCoverUrl", awsController.postCoverUrl);

// user routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser)

//post routes
router.post('/posts',midd.userAuth, postController.createPost)
router.get('/posts',midd.userAuth,postController.getPost)
