const express= require('express');
const env= require('./config/environment');

//to manage the logs 
const logger= require('morgan');

const cookieParser= require('cookie-parser');
const port =8000;
const path= require('path');
const app= express();



const passport=require('passport');
const db = require('./config/mongoose')
//this is for layout, include the library and use that same library 
const expressLayout=require('express-ejs-layouts');
const passportJWT= require('./config/passport-jwt-strategy');
//used for session cookies
const session= require('express-session');

// const passportLocal= require('passport-local');
const passportLocal= require('./config/passport-local-strategy');



const passportGoogle=require('./config/passport-google-oauth2-strategy');


//setup the chat server to be used with socket.io
const chatServer= require('http').Server(app);
const chatSockets= require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat socket is running on port 5000");







//for mongo-store, every time when we restart server, user identiity was lost, for this problem we have use
//MONGOSTORE, it wiill require parameter->session
const MongoStore=require('connect-mongo')(session);

//sass middlware
const sassMiddleware= require('node-sass-middleware');
//this is used to display flash messages
const flash = require('connect-flash');
//import our cuastom middlewate for flash messages 
const customMware= require('./config/middleware');


if(env.name=='development'){
app.use(sassMiddleware({
    src:path.join(__dirname, env.asset_path ,'scss'),
    dest:path.join(__dirname, env.asset_path ,'css'),
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
    }));
}


app.use(express.urlencoded());
app.use(cookieParser());
//for including static files 
app.use(express.static(env.asset_path));
//make the upload part available to uploads -->uploads will become /codeail/uploads
//__dirname -->current directory 
app.use('/uploads',express.static(__dirname + '/uploads'));

// app.use(logger(env.morgan.mode,env.morgan.options));


app.use(expressLayout);
//to use different static files(css,html.js) for every page 
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);





//set up view engine
app.set('view engine','ejs');
// app.set('views',path.join(__dirname,'views'));  
app.set('views','./views');



 
//use express-session 
//MongoStore is used to store session cookie in the db 
app.use(session({
    name:'codeail',
    //TODO change the secret before deployment in production mode
    //encrypted key     
    secret:env.session_cookie_key,
    saveUninitialized:'false',
    resave:'false',
    cookie:{
         //milliseconds, max age of cookie specified here 
        maxAge:(1000 * 60 * 100)
    },
    store:new MongoStore(
        {
             mongooseConnection:db,
             autoRemove: 'disabled'

        },
        function(err){
            console.log(err || 'connect-mongoose setup OK')
        }
    
    )

}));

app.use(passport.initialize());
app.use(passport.session());

//check if session cookie is present or not 
app.use(passport.setAuthenticateduser);


//use flash messages
app.use(flash());
app.use(customMware.setFlash);

//initially whenever we run localhost:8000
//the route wii be transfered to index.js file inside routes folder
app.use('/', require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log(`Server will not run on this port:${err}`);//interpoletion

    }

    console.log(`server is running on port:${port}`);

})
