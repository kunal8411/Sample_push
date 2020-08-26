const mongoose= require('mongoose');

const likeSchema= new mongoose.Schema({
    user:{
        // type:mongoose.Schema.type.o
        // type:mongoose.Schema.Types.ObjectId
        type: mongoose.Schema.ObjectId
    },
    //this defines the object id of liked post 
    likable:{
        type: mongoose.Schema.ObjectId,
        require:true,
        //path to some other field, and that path will define which ref to take for this field 
        refPath: 'onModel'

    },
    //this field is used for defining the type of liked object since it is the dynamic reference 
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},{
    timestamps:true
});


const Like= mongoose.model('Like',likeSchema);
module.exports= Like;

