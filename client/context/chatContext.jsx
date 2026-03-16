import { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();


export const ChatProvider =({children})=>{
   
   const [messages, setmessages] =useState([]);
   const[users,setusers] =useState([]);
   const [selectedUser , setSelectedUser] =useState(null);  
   const [unseenmessages ,setunseenmessages] =useState({})


const {socket , axios} =useContext(AuthContext)


//function to get all users for sidebar

const getUsers = async() =>{
    try{

      const {data} =   await axios.get("/api/messages/users");
       

      if(data.success){
        setusers(data.users);
        setunseenmessages(data.unseenmessages);

      }

    }
    catch(error){
        toast.error(error.message);

    }
}

//function to get messages for selected user

const getmesaages =async(userId) =>{
    try{
      const {data} =  await axios.get(`/api/messages/${userId}`)

    }
    catch(error){
        toast.error(error.message);
    }

}


//function to send messages to selectefd user

const sendMessage =async(message)=>{
    try{
        const {data} =await axios.post(`api/messages/send/${selectedUser._id}`,message);
        if(data.success){
            setmessages((prev) =>[...prev , data.newMessage])
        }

        else{
            toast.error(data.message);
        }
   
   
    }
    catch(error){
        toast.error(error.message);
    }
}

//function to subscribe to message for selsected user

const subscribeTomessages = async() =>{

    if(!socket)return;
    socket.on("newMessage" , (newMessage)=>
        {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setmessages((prevmessages)=>[...prevmessages, newMessage])
                axios.put(`/api/messages/mark/&{newMessage._id}`)

            }

            else{
                setunseenmessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,[newMessage.senderId] : (prevUnseenMessages[newMessage.senderId] || 0) + 1
                }))
            }

    }
)

    }




    return(
    <ChatContext.Provider value ={value}>
        {children}
    </ChatContext.Provider>
    )
}