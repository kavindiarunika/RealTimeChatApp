import { useState } from "react";
import { createContext } from "react";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.default.baseURL = backendUrl;
export const AuthContext = createContext();

export const AuthProvider =({children}) =>{
    
   const [token,setToken] = useState(localStorage.getitem("token"));
   const [authUser ,setAuthUser] = useState(null);
   const [onlineUsers ,setOnlieUsers] = useState(null);
   const [socket , setSocket] = useState(null);

    const checkAuth = async() =>{
        try{
           
       const {data} =  await axios.get("/api/auth/check");
       
       if(data.success){
        setAuthUser(data.user)
       }
        }
        catch(error){

        }

    }
    const value ={
          axios,
          authUser,
          onlineUsers,
          socket


    }

    return(
        <AuthContext.Provider>
     {children}
        </AuthContext.Provider>
    )

}

