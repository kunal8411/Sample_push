const express = require('express');


const router = express.Router();


const passport= require('passport');

var userController = require('../controllers/users_contoller');

const forgotpasswordController= require('../controllers/forgotpassoword/forgot_password');

//when we hit "localhost:8000/users/profile" in url this code will run 
//passport.checkAuthentication-> profile page is only visible when user will log in with correct creds
router.get('/profile/:id',passport.checkAuthentication, userController.profile);


//to update the details of current sign in user
router.post('/update/:id',passport.checkAuthentication, userController.update);

router.get('/login', userController.login);

router.get('/signup',userController.signup);


router.post('/create', userController.create); 


//use passport as a middleware to authenticate
router.post('/createsession', passport.authenticate(
    'local',
    {
        failureRedirect: '/users/login'
        
    },
), userController.creteSession);

 
router.get('/signout',userController.destroySession);
router.get('/forgotPassword',forgotpasswordController.forgotpassword);
router.post('/checkmail',forgotpasswordController.checkmail);
router.get('/confirmpassword',forgotpasswordController.confirmPassword);
router.post('/updatepassword',forgotpasswordController.updatePassword);


//send data to google 
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

//callback url 
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),userController.creteSession)


// router.get('/signout',userController.delete);



//this is important statement
module.exports=router;