const nodemailer= require('nodemailer');
const ejs=require('ejs');
const path= require('path');
// const { relative } = require('path'); 

const env= require('./environment');

//this function will send mails 
let transporter= nodemailer.createTransport(env.smtp);

//we have used arrow function here, used to render the HTML file(mail template)
//rlative path-->from where mail will be send
let renderTemplate= (data,relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log('error in rendering template',err);
                return;

            }
            mailHTML=template;

        }
    )
    return mailHTML;

}

module.exports ={
    transporter: transporter,
    renderTemplate: renderTemplate
}