// const nodeMailer= require('../config/nodemailer');
const nodemailer = require('../config/nodemailer');

exports.newComment= (comment) =>{

    //in nodemailer.js we have mentioned relativePath for that we mentioned comment here 
    let htmlString= nodemailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs');

    //this function willl send mails
    nodemailer.transporter.sendMail({
        from:'kunal.khairnar96@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString
        //info will contain information about the request that has been sent 
    },  (err,info) =>{
        if(err){
            console.log('error in sending mails',err);
            return;

        }
        console.log('Message sent',info);
        return;


    });
}
