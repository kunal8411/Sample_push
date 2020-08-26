const mongoose= require('mongoose');

const env= require('./environment');

// create a database having name codeais-developnment 
mongoose.connect(`mongodb://localhost/${env.db}`);



//Acquire the connection:-check whether db is  connected or not
const db= mongoose.connection;

//error
db.on('error',console.error.bind(console,'erroro connecting to database '));

//if up and running
db.once('open',function(){
    console.log(" database connected successfully");
    
})

module.exports=db;