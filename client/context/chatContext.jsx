import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";


export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  const [messages, setmessages] = useState([]);
  const [users, setusers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenmessages, setunseenmessages] = useState({});

  const { socket, axios } = useContext(AuthContext);



  // get users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setusers(data.users);
        setunseenmessages(data.unseenmessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // get messages
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      if (data.success) {
        setmessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // send message
  const sendMessage = async (message) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        message
      );

      if (data.success) {
        setmessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // socket listener
  const subscribeTomessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;

        setmessages((prev) => [...prev, newMessage]);

        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setunseenmessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  //function to unsubscribe from messages

  const unSunscribeTomessages = () => {
    if (!socket) socket.off("newMessage");

  }

  useEffect(()=>{
    subscribeTomessages();

    return ()=> unSunscribeTomessages();
  },[socket,selectedUser])
  const value = {
    messages,
    users,
    selectedUser,
    unseenmessages,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    subscribeTomessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};