//used to import database
const User=require('../models/user');

const fs= require('fs');
const path= require('path');




module.exports.profile=function(req,res){
    User.findById(req.params.id, function(err,user){
        return res.render('../views/users_profile',{
            profile_user:user
        });
    });
    // return res.render('../views/users_profile');

    // if(req.cookies.user_id){
    //     User.findById(req.cookies.user_id,function(err,user){
    //         if(user){
                
    //             return res.render('users_profile',{
    //                 title:"user Profile",
    //                 user:user
    //             });

    //         }
    //         return res.redirect('/users/login');
    //     });
    // }
    // else{
    //     return res.redirect('/users/login')
    // }
    //
}

module.exports.update= async function(req,res){
    // if(req.user.id == req.params.id){

    //     // req.body is equivalent to req.body.name,req.body.email, i.e.-> all the fields in DB
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
    //         return res.redirect('back');

    //     })
    // }else{
    //     return res.status(401).send('Unauthorized');

    // }

    if(req.user.id == req.params.id){
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('********Multer Error',err);
                }
                // console.log(req.file);
                user,name=req.body.name;
                user.mail=req.body.email;

                // if user uploaded the image then only proceed
                if(req.file){


                    // if lready we have uploaded file previously, then delete that file 
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    user.avatar=User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                
                return res.redirect('back');

                

            });

        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    
    
    }else{
        req.flash('error','Unauthorized');

        return res.status(401).send('Unauthorized');
    }

}


module.exports.login=function(req,res){
    //if user is already loged in then he will not able to go to login page
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }

    return res.render('../views/login');

}


module.exports.signup=function(req,res){
    //if user is already loged in then he will not able to go to signup page
    if(req.isAuthenticated()){
       return res.redirect('/users/profile')
    }

    return res.render('../views/signup');
    
}



//get the sign up data 
module.exports.create= function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');

    }  

    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('error finding in user in sign up');
            return; 
     
        }
        if(!user){
            User.create(req.body, function(err,user){
                if (err){console.log('error in creating user while signing up');  return }


                return res.redirect('/users/login'); 
            })
        }
        else{
            return res.redirect('back'); 
            
        }
    });

}


//for login page, validate login information of user,
//after login successfull, redirect to home page 
module.exports.creteSession= function(req,res){

    req.flash('success','Logged in Successfully');
    return res.redirect('/'); 
     
}

//sign-out controller
module.exports.destroySession= function(req,res){
    //this is by default method provided by passoport 
    req.logout();
    req.flash('success','Logged out Successfully');
    return res.redirect('/');
}




// module.exports.delete= function(req,res){
//     id= req.query.id;
    
//     if(id==req.cookies.email){
//         res.clearCookie(req.cookies.email);
//     }
//     return res.redirect('/users/login'); 

// }