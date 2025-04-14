import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
const JWT_SECRET = "asdfghjkl12345678"

// * This method used to check the user is admin or not.

export const isAdmin = async (req,res,next) =>{
     try {

        const user = await userModel.findById(req.user._id);

        if(user.role !== 1){
            return res.status(400).send({
                success:false,
                message:"Unathoraized access",
            })
        }
        else{
            next();
        }

     } catch (error) {
        console.log(error);
     }
}

export const requireSignin = async (req,res,next) =>{
    try {
        const token = req.headers.authorization;


    if(!token){
        return res.status(401).send({
            message:"Token is missing in header",
            token:token,
        })
    }
    const decode = jwt.verify(token, JWT_SECRET);
    req.user = decode;
    next();
        
    } catch (error) {
        res.status(401).send({
            message:"Something went wrong in token verification",
            msg:error.message
        })
    }
}
