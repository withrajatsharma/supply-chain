import { Schema, model, models } from 'mongoose';


const userSchema = new Schema({
    name:{
        type: String,
    },
    email:{type:String,},
    password:{type:String},
    role:{
        type:String,
        enum:["buyer","seller","delivery"]
    },
    createdOn:{type:Date,default:new Date().getTime()},
});

// module.exports = mongoose.model("User",userSchema);

const User = models.User || model("User", userSchema);

export default User;