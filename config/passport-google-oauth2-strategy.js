const passport = require('passport');

const googleStrategy= require('passport-google-oauth').OAuth2Strategy;
const crypto= require('crypto');
const User= require('../models/user');
const env= require('./environment');
//new stategy 
passport.use(new googleStrategy({
    clientID: env.google_client_ID,
    clientSecret: env.google_client_Secret,
    callbackURL: env.google_callback_URL,
    
    
},
//profile will containg users information 
function(accessToken,refreshToken,profile,done){
    //find user
    console.log(accessToken);
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){console.log('error in google strategy passport',err); return;}

        // console.log(profile);
        if(user){
            return done(null,user);

        }else{

            //if not found create the user and set it as req.user(signin the user)
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){console.log('error in creatign user',err); return;}

                return done(null,user);

            })
        }

    });
}
));


module.exports= passport;


