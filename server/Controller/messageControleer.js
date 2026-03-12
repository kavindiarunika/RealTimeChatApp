
import { unwatchFile } from "fs";
import messageshema from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io,userSocketMap} from '../server.js';


export const getUserForSidebar =async(req,res) =>{
    try{

        const userId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password")


        //unseen messages
        const unseenMessages ={};
        const promises = filteredUsers.map(async(user)=>{
            const messages = await messageshema.find({senderId:user._id ,receiverId:userId},{seen:false})
              

            if(messages.length >0){
                unseenMessages[user._id] = messages.length;

            }


        })
        
        await Promise.all(promises);
        res.json({success:true , users:filteredUsers ,unseenMessages })

    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})

    }
}

//get all messages for selected user

export const getMessages = async(req ,res) =>{
    try{

        const {id:selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await messageshema({
            $or:[
                {senderId:myId , receiverId:selectedUserId},
                {senderId:selectedUserId , receiverId:myId}
            ]
        })
        await messageschema.updateMany({senderId :selectedUserId ,receiverId:myId} ,{seen:true})
        res.json({success:true , messages})
    }
    catch(error){

         console.log(error.message);
        res.json({success:false,message:error.message})


    }
}

//mark message as seen

export const markmessageAsSeen =async(req,res)=>{
    try{

        const {id} =req.params;
        await messageshema.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})

    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }

}

//send message to selected User

export const sendMessage =async(req,res) =>{

    try{
        const {text , image} =req.body;
        const receiverId = req.params.id;

        const senderId = req.user._id;

        let imageUrl ;

        if(image){
            const uploadResponse = await cloudinary.uploader.uplod(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await messageshema.create({
            senderId,
            receiverId,
            image:imageUrl
        });
         
        //emit the new message to the receiver socket
        const receiverSocketId = userSocketMap[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.json({success:true,newMessage});


    }
    catch(error){

                console.log(error.message);
        res.json({success:false,message:error.message})

    }
}