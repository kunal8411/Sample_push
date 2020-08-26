//here worker will do the work for sending mails for us 

const queue= require('../config/kue');
const commentsMailer= require('../mailers/comments_mailer');
const { deleteOne } = require('../models/post');


//every queue will have process function
//queue.process('name_of_queue')
queue.process('emails',function(job,done){
    console.log('email worker is processing a job',job.data);
    //job.data conains the comment which user will type 

    //call the commentmailer to send the mail with comment(i.e job.data)
   
    commentsMailer.newComment(job.data);

    done();

    
})