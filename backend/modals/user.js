import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import  'dotenv/config';
const userSchema =  new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique:true,
        trim:true,
        lowercase: true,
        minLength:[6,'Email must be at least 6 charaters long'],
        maxlength:[50,'Email must not be longer than 50 charaters']
    },
    password:{
        type : String,
        select: false
    }
}) 

userSchema.statics.hashPassword = async (password)=>{
    return await bcrypt.hash(password,  10);

}

userSchema.methods.isValidpasword = async(password)=>{
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateJWT = () =>{
    return jwt.sign({email:this.email}, process.env.JWT_SECRET);
}

const User  = mongoose.model("user", userSchema);
export default User;  