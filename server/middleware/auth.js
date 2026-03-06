
//middleware to protect route

import User from "../models/User"
import jwt from "jsonwebtoken"
export const protectRoute =async(req,res,next)=>{

    try{

        const token = req.headers.token;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({success:false , message:"user not found"})

          req.user = user;
          next();
    }
    catch(error){
        return res.json({success:false , message:"invalid token"})
    }



}


//controleer to check if user is authenticated

export const checkAuth =(req,res)=>{

    res.json({success:true , user:req.user})

}