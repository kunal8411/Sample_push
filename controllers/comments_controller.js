const Comment= require('../models/comment');

const Post= require('../models/post');
const Like= require('../models/like');


const kue= require('../config/kue');
const commentMailer= require('../mailers/comments_mailer');

const commentsEmailWorkers= require('../workers/comment_email_workers');
const queue = require('../config/kue');


module.exports.create= async function(req,res){

    try{
        let post= await Post.findById(req.body.post);
        //if post find then we will add comment schema 
        if(post){
            let comment=await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user:req.user._id
    
            });

            // if(req.xhr){    
                // comment=await comment.populate('user','name').execPopulate(); 
            //     return res.status(200).json({
            //         data:{
            //             //to aceess the users name use this one (populate)
            //             comment:comment
            //         },
            //         message:'comment added successfully'
            //     })
            // }

                //update the post database, and save it
                //every time when we update the db, we need to save it
                post.comments.push(comment);
                post.save();
                
                comment=await comment.populate('user','name email').execPopulate();


                //create queue , and put a task in queue(i.e. Job)
                //if queue is not created then create the queue and if queeue is created, 
                //push the job in queue, emails==>should be same name whatever we have declared in comment_email_workers.js
                let job=queue.create('emails',comment).save(function(err){
                    if(err){
                        console.log('error in sending to the queue',err);
                        return;

                    }

                    //whenever something enqued, that id will come here 
                    console.log('job enqued',job.id);
                });



                //send mail after creating comment
                // commentMailer.newComment(comment);

                 req.flash('success','comment published');

                res.redirect('/');
           
           
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
    //this post i have mentioned in home.ejs comment form in name attribute
    
  
}



module.exports.destroy= async function(req,res){
    try{
        let comment=await Comment.findById(req.params.id);
        if(comment.user == req.user.id){

            //save the post id in var, for deleting the comment in Post DB
            let postId= comment.post;

            //this will delete the comment from Comment DB
            comment.remove();

            //find the id in Posts schema, this will find id in Post schemas comments array and update the id 
            //pull the comment from comments attribute in post DB using req.params.id
           let post= Post.findByIdAndUpdate(postId,{$pull:{comments: req.params.id}});


           await Like.deleteMany({likable:comment._id, onModel:'Comment'});
           

           if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Post deleted"
            });
        }
            return res.redirect('back');
 
        }
        //if that does not match return back
        else{
            return res.redirect('back');
        }
        
    }catch(err){
        console.log('Error',err);
        return;
    }
    
        

    
}