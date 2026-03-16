import { useEffect, useState } from "react";
import { createContext } from "react";
import { connect, io } from "socket.io-client";
import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlieUsers] = useState(null);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

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

  const logut = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlieUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("logout successfully");
    socket.disconnect();
  };

  //update profile function to handle profile update

  const updateProfile = async () => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);

      if (data.success) {
        setAuthUser(data.user);
        toast.success("update successfully");
      }
    } catch (error) {
      toast.error(error.message);
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

    newSocket.conncet();
    setSocket(newSocket);

    newSocket.on("online-users", (userIds) => {
      setOnlieUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
