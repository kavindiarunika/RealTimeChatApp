import React, { useContext, useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/CHatContainer";
import RightSideBar from "../components/RightSideBar";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  
  const {     
    messages,
    users,
    selectedUser,
    unseenmessages,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    subscribeTomessages } = useContext(ChatContext);
  
    const { 
      axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logut,
        updateProfile,} =useContext(AuthContext);

    const scrollEnd =useRef();

    const [input,setinput] =useState('');
    

    useEffect(()=>{} ,[selectedUser])
  
    return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative 
        ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <SideBar
         
        />

        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />

        <RightSideBar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
};

export default Home;
