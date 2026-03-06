import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/util.js";
import User from "../models/User.js";
export const signup =async(req , res)=>{

    const { email, fullName, password, bio}= req.body;
    try{

         if(!fullName || !email || !password || !bio){
            return res.json({success:false ,message:"missimg field"})
        }

        const user =await User.findOne({email});
       if(user){
         return res.json({success:false , message:"acout already exists"})

       }

       const salt =await bcrypt.genSalt(10);
       const hashedPassword =await bcrypt.hash(password,salt)

       const newUser =await User.create({
        email, fullName, password:hashedPassword, bio

       })
       const token= generateToken(newUser._id)

       res.json({success:true,userData:newUser,token,message:"account created successfully"} )
       

    }
    catch(error){

        res.json({success:false , message:error.message})
       
    }

}
//controller to login user

export const loginUser =async(req,res)=>{

  try{

    const {email,password} =req.body;

    const userData = await User.findOne({email})

    const ispasswordcorrect = await bcrypt.comapre(password,userData.password)
    

    if(!ispasswordcorrect){
        return res.json({success:false , message:"invalid credentials"})
    }

    const token = generateToken(userData._id);

    res.json({success:true,userData,token,message:"login successful"})
  }
  catch(error){
    
    res.json({success:false , message:error.message})
  }


}

//constoleer to check if user is authenticaed

export const checkAuth = (req,res)=>{
 res.json({success:true , user:req.user})
}

//controller to update user profile
export const updateProfile =async(req,res)=>{
    
  try{

    const { profilepic, fullName,  bio}= req.body;
       

    const userId = req.user._id;
    let updateedUser;

    if(!profilepic){
      updateedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
    }
    else{

      const upload = await cloudinary.uploader.upload(profilepic)
    }
  }
  catch(error){
    res.json({success:false , message:error.message})
  }
}


