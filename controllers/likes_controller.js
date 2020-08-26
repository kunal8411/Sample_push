const Like= require('../models/like');
const Post= require('../models/post');
const Comment= require('../models/comment');




module.exports.likes= function(req,res){
    res.end('<h1>Wow she liked my picture</h1>');
}


module.exports.toggleLike= async function(req,res){

    //on clicking of likes button-->we will get this link-->likes/toggle/?id=abcdef&type=Post/Comment
    //we will check if user has already liked this post or not, this we will decide using deleted boolean variable
    //we will find the likable, wheather it is Post or Comment
    let likable;  //what i have liked and id of that Post/Comment==>whether post or comment ?
    let deleted=false;
    if(req.query.type=='Post'){
        //get id of that post 
        likable=await Post.findById(req.query.id).populate('likes');
    }else{
        likable= await Comment.findById(req.query.id).populate('likes');
    }

    //check if like already existed or not 
    //i have liked any post or comment already?
    let existingLike=Like.findOne({
        likable:req.query.id,
        onModel:req.query.type,
        user:req.user._id

    })


    //if like already existed 
    if(existingLike){

        likable.likes.pull(existingLike._id);
        likable.save();
        existingLike.remove();
        deleted=true;

    }else{
        //else make new like in Like model
        let newLike=Like.create({
            user:req.user._id,
            likable:req.query.id,
            onModel:req.query.type
        });
        //now add the like in Like/Comment schema 
        likable.likes.push(newLike._id);
        likable.save();


    }
    return res.json(200,{
        message:'Request Succesfull!',
        data:{
            deleted:deleted
        }
    })
    
}