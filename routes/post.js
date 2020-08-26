const express=require('express');

const router= express.Router();

const passport= require('passport');

var postController= require('../controllers/post_Controller');

router.get('/kunal',postController.post);

router.post('/create', passport.checkAuthentication, postController.create);

router.get('/destroy/:id', passport.checkAuthentication, postController.destroy);

module.exports=router;

