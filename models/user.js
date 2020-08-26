const mongoose= require('mongoose');
const multer= require('multer');
const path= require('path');
const AVATAR_PATH= path.join('/uploads/users/avatars');


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    avatar:{
        type:String
    }
},  {
        timestamps: true
});

//used to store the files on disk 
let storage = multer.diskStorage({
    //cb is a callback function 
    //destination-->in which folder the uploaded file should be stored 
    destination: function (req, file, cb) {
        //The path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
        //from curr dir .. will go to models and then search for uploads- defined n avatar_path
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    //if 2 same files with same name, to differentiate them we use filename function  
    //date.now()-->apend the current time in milliseconds 
    //what will be name of file inside the folder 
    //fieldname is avatar defined in schema 
    //file.fieldname-->every file will be stored as avatar-date.now value

    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });


//static methods
//Accept a single file with the name fieldname('avatar'). The single file will be stored in req.file
userSchema.statics.uploadedAvatar= multer({ storage: storage }).single('avatar');
userSchema.statics.avatarPath= AVATAR_PATH;



//this will create collection having name user and schema declared in userSchema 
const User=mongoose.model('User',userSchema); // here instead of user it should  User with capital U


module.exports= User;