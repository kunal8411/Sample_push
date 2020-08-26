const fs= require('fs');
const rfs=require('rotating-file-stream');
const path = require('path');


//where the logs will get stored 
const logDirectory= path.join(__dirname, '..production_logs');

//check if logDirectory is already present or not , if not it will create that directiry 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);


//access.log is a  file 
// const accessLogStream= rfs('access-log',{
//     interval:'1d',   //rotat daily 
//     path:logDirectory
// });



const development={
    name: 'development',
    asset_path:'/assets',
    session_cookie_key:'blahsomething',
    db:'codeail_development',
    smtp:{
      
            service:'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
        
            //here we check authentication for mail id from where we are sending mails 
            auth:{
                
                user: 'kunal.khairnar96',
                pass: 'kunal@be27'
            }      
    },
   
    google_client_ID: "755361240925-fvh26q0tfm3ftihnmaf1i69f3m7fn659.apps.googleusercontent.com",
    google_client_Secret: "ak8v_jpMi-idySMEtE2loyKc",
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret:'codeail',
    // morgan:{
    //     mode:'dev',
    //     options:{stream: accessLogStream}
    // }

}

const production= {
    name: process.env.CODEAIL_ENVIRONMENT, 
    asset_path: process.env.CODEAIL_ASSET_PATH,
    session_cookie_key: process.env.CODEAIL_SESSION_COOKIE_KEY,
    db: process.env.CODEAIL_DB,
    smtp:{
       
            service:'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
        
            //here we check authentication for mail id from where we are sending mails 
            auth:{
                
                user:process.env.CODEAIL_GMAIL_USERNAME,
                pass:process.env.CODEAIL_USER_PASSWORD 
            }      
    },
    google_client_ID: process.env.CODEAIL_GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.CODEAIL_GOOGLE_CLIENT_SECRET ,
    google_callback_URL: process.env.CODEAIL_GOOGLE_CALLBACK_URL,   
    jwt_secret: process.env.CODEAIL_JWT_SECRET,
    // morgan:{
    //     mode:'combined',
    //     options:{stream: accessLogStream}
    // }
}

module.exports= eval(process.env.NODE_ENV) == undefined ? development: eval(process.env.NODE_ENV);






