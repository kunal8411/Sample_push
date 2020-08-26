{
    //method to submit post data for new post using AJAX 
    let createPost= function(){
        let newPostForm= $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();


            $.ajax({
                type:'post',
                url: '/post/create',
                data: newPostForm.serialize(), //converts form data into JSON data
                success: function(data){ 
                     //Here we send request to controller(post_controller), controller check if request is XHR then controller send some information in one variable(data) and using that var we can show on server 
                   console.log(data.data);
                     let newPost=newPostDom(data.data.post);
                   $('#posts-like-container>ul').prepend(newPost);
                //    req.flash('success','post created successfully');
                   deletePost($(' .delete-post-button', newPost));
                //    req.flash('success','post created successfully');
                },
                error: function(error){
                    console.log(error.responseText);

                }
            })

        });

    }


    //method to create a post in DOM 
    //converting HTML text into jQuery object 
    let newPostDom= function(post){
        return $(`<li id="post-${post._id}">

        <p>
             
      <small>
              <a class="delete-post-button" href="/post/destroy/${post._id}">X</a>
      </small>
      
                Post:
              ${post.content }
             <br> 
             <small>
                     Created By: 
              ${post.user.name}
             </small>
             <br>
             <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id:{post._id}&type=Post">
                0 Likes
                </a>
             </small>
        </p>
        <div class="post-comments">
               
              <form action="/comments/create" method="POST">
                      <input type="text" name="content" placeholder="Comment..." required>
                      <input type="hidden" name="post" value="${post._id}">
                      <input type="submit" value="Add-Comment">
              </form>
            
              <div class="post-comment-lists">
                      <ul id="post-comments-${post._id}">
    
                              
                      </ul>
              </div>
        </div>


        
    </li>`)
    }


    //mehod to delete post from DOM , this function will send ajax request 
    let deletePost= function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url: $(deleteLink).prop('href'),// to take href link we use this prop 
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();  //find the post id associated with list and delete that post 
                    // req.flash('success','post deleted! ');
                },
                error:function(error){
                    console.log(error.responseText);

                }

            })


        })
    }


    // ajax create comment form 
    // let createComment= function(){
    //     let newCommentForm= $('#new-comment-form');

    //     newCommentForm.submit(function(e){
    //         e.preventDefault();


    //         $.ajax({
    //             type:'post',
    //             url: '/comments/create',
    //             data: newCommentForm.serialize(), //converts form data into JSON data
    //             success: function(data){ 
                
    //                 console.log("comments",data);

    //                 let newComment= newCommentDom(data.data.comment);
    //                 $('#post-comment-lists>ul').prepend(newComment);
    //             },
    //             error: function(error){
    //                 console.log(error.responseText);

    //             }
    //         })

    //     });

    // }


    // method to create a comment in DOM 
    // converting HTML text into jQuery object 
    // let newCommentDom= function(comment){
    //     return $(` <li  >
    //     <p>
                        
    //                     <small>
    //                             <a href="/comments/destroy/${comment.id}">X</a>
    //                     </small>
                       
    //           ${comment.content}
    //             <br>
    //             <small>
    //                    ${comment.user.email}
    //             </small>
                
    //     </p>
    //   </li>`)
    // }




   
    createPost();
    // createComment();

    deletePost();

}