// const nodeMailer= require('../config/nodemailer');
const nodemailer = require('../config/nodemailer');

exports.forgotpassword= (link) =>{

    //in nodemailer.js we have mentioned relativePath for that we mentioned comment here 
    let htmlString= nodemailer.renderTemplate({link:link}, '/comments/forgotpassword.ejs');

    //this function willl send mails
    nodemailer.transporter.sendMail({
        from:'kunal.khairnar96@gmail.com',
        to: link.user.email, 
        subject: "Reset your Codeail account password",   
        html: htmlString
        //info will contain information about the request that has been sent 
    },  (err,info) =>{
        if(err){
            console.log('error in sending mails',err);
            return;

        }
        // console.log('Message sent',info);
        return;


    });
}
