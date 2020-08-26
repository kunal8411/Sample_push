
const Post= require('../models/post');
const User = require('../models/user');
// const { populate } = require('../models/post');

module.exports.home= async function(req,res){
    try {
     let posts =await Post.find({})
     .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        },
        populate:{
            path:'likes'
        }
        //populate likes for both posts and comments 
    }).populate('likes');

    let users= await User.find({});
            
    
    return res.render('home',{
         posts: posts,
         all_users: users

    });
   
    }catch(err){
        console.log('Error',err);
        return;

    }
    
    
        
}