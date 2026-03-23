/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { createContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/user/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //login function to handle user auth and socket

  const login = async (state, cretentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, cretentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //logout function to loggout

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("logout successfully");
    socket?.disconnect();
  };

  //update profile function to handle profile update

  const updateProfile = async (data) => {
    try {
      const res = await axios.put("/api/user/update-profile", data);
      // update user in state if needed
      setAuthUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  //connect Socket function
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("online-users", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (!token) return;

    axios.defaults.headers.common["token"] = token;

    const verify = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error(error);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
