import userModal from "../modals/user.js";
import * as userservice from "../services/user.service.js";
import {validationResult} from 'express-validator';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import  'dotenv/config';
import redisClient from '../services/redis.js';



//createuser

export const createUserController =  async(req , res) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }
    try {
         const user =  await userservice.createUser(req.body);
         delete user._doc.password
           
          res.status(200).json({
            user,
        
           })
        
        
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message)
        
        
    }

      
        
}

//login user

export const loginController =  async(req , res )  => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }

    try {

        const {email , password} = req.body;
        const user =  await userModal.findOne({email}).select('+password');
        if(!user){
           return res.status(401).json({
                error: 'invalid credentials'
            })
         }
      
         const ismatch = await bcrypt.compare(password,user.password);
         if(!ismatch){
            return res.status(401).json({
                error: 'invalid credentials'
            })

         }
         const token = jwt.sign(
            { email: user.email, id: user._id,},
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            });

            delete user._doc.password;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: `User Login Successfully`,
        });


        
    } catch (error) {
        res.status(400).send(error.message);
        }
        
    }

// user profile
export const  profileController = async (req ,res) => {
    

    console.log(req.user);

    res.status(200).json({
         user : req.user,
    })



}

//logout
export const logoutController = async(req, res) => {

    try { 

        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        redisClient.set(token ,'logout', 'EX', 60*60*24);
        res.status(200).json({
            message: 'logged out succesfully'
        })
        
    } 
    catch (error) {
        console.log(error)
        
    }

}

export const getAllUserController = async(req,res)=>{
    try {
        const loggedInUser = await userModal.findOne({
            email: req.user.email
        })


        const AllUser = await userservice.getAllUser({userId: loggedInUser._id})

        return res.status(200).json({
            users:AllUser
        })
        
    } catch (err) {
        
        console.log(err)
        res.status(400).json({error : err.message})
        
    }

}