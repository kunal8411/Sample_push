
const Post=require('../models/post') ;

const Comment=require('../models/comment');

const Like= require('../models/like');


module.exports.post=function(req,res){
    return res.end('<h1>View Kunals Post here  </h1>');

}

//create post 
module.exports.create= async function(req,res){
    //setting the values to database 

    try{
        let post= await Post.create({
            content: req.body.content,
            user:req.user._id 
        });
        let newPost=await post.populate('user', 'name').execPopulate();
        if(req.xhr){    
            return res.status(200).json({
                data:{
                    //to aceess the users name use this one (populate)
                    post:newPost
                },
                message:'post created successfully'// this was the error 
            })
        }

        req.flash('success','post published');
        return res.redirect('back');
    
    }catch(err){
        console.log('Error',err);
        return;
    }
   
}

//to delete post and comments 
module.exports.destroy=async function(req,res){
    try{
        let post=await Post.findById(req.params.id);

        if(post.user == req.user.id){  //check if same person is deleting the post, which have created this post  

            // change: delete the associated likes for popst and all comments likes
            await Like.deleteMany({likable:post, onModel:'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});
            


            post.remove();   //remove this post, post.find() have remove object as well
            
            await Comment.deleteMany({ post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },  
                    message:'post deleted successfully!'

                })
            }

            req.flash('success','Post and associated comment deleted!');


                return res.redirect('back');
           

        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
    
  
}