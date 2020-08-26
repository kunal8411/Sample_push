
const User= require('../../models/user');
const ForgotPassword=require('../../models/forgotpassword');
const forgotmailer= require('../../mailers/forgot_password');


module.exports.forgotpassword=function(req,res){
    return res.render('../views/forgotpwd/forgotpassword')
}




module.exports.checkmail= async function(req,res){
    try{

        let user= await User.findOne({email:req.body.email});
    if(!user){
        return res.end('No username found with that mail id')
    }else{
        let pwd=await ForgotPassword.create({
            user:user.id,
            token:"abc123",
            isValid:true
      
          });
      

          //populate user from user database, and then pass further so pwd will have users info also 
          pwd= await pwd.populate('user', 'name email').execPopulate();

        //   console.log('value of pwd is:',pwd);
        //   console.log('users mail id is',pwd.user.email);
        //   console.log('users name is :',pwd.user.name);

          //now here we need to send mail to user with one link(i.e. Access Token)
          //give pwd ==>to render pwd.user.name,wd.user.email
          forgotmailer.forgotpassword(pwd);
          return res.redirect('back');

        //   return res.render('../views/forgotpwd/confirmpwd');
    }
    }catch(err){
        console.log('Error',err);
        return;
    }

    


}

module.exports.confirmPassword=function(req,res){
    return res.render('../views/forgotpwd/confirmpwd');

    
}


module.exports.updatePassword= async function(req,res){

    try{

        let email= User.findById({email:req.body.email});
    if(email){
        if(req.body.password!=req.body.coonfirmpassword){
            return res.end('<h1>Password does not matches</h1>');
        }else{
            //use findByIdAndUpdate function to update the database 
            //and then save that user 
            let user= User.update({
                password:req.body.password
                });
                
                if(!user){
                    console.log('error in updating the user details',err);
                    return;
                }else{
                    // User.save();
                
                    // (await email).save();

                    return res.end('<h1>Password changed successfully</h1>');
                }
          
        }
    
    }
    }catch(err){
        console.log('Error',err);
        return;
    }



}