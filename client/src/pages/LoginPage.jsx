import React from "react";
import assets from "../assets/assets";
import { useState } from "react";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("sign-up");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmit, setIsDataSubmit] = useState(false);


  const onSubmitHander =(event)=>{
    event.preventDefault();

    if(currentState === "sign-up" && !isDataSubmit){
      setIsDataSubmit(true)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-between gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left Section */}

      <img src={assets.logo_big} alt="" className="w-[min(30vw ,250px)]" />

      {/* Right Section */}

      <form onSubmit={onSubmitHander} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {" "}
          {currentState}
          {isDataSubmit &&  <img onClick={()=>setIsDataSubmit(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" /> }
         
        </h2>
        {currentState === "sign-up" && !isDataSubmit && (
          <input
            type="text"
            className="p-2 border border-gray-500 rounded-mg focus:outline-none"
            placeholder="full time"
            required
          />
        )}

        {!isDataSubmit && (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(email.target.value)}
              type="email"
              placeholder="email address"
              className="p-2 border boder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ting-indigo-500"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(password.target.value)}
              type="password"
              placeholder="password"
              className="p-2 border boder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ting-indigo-500"
              required
            />
          </>
        )}
        {currentState === "sign-up" && !isDataSubmit && (
          <textarea
            nrows={4}
            className="p-2 border border-gray-500 rounded-md foncus:outline-none focus:ring-indigo-500"
            placeholder="provide a bio...."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        )}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "sign-up" ? "create Accound" : "Login now"}
        </button>

        <div className="flex items-center gap-2 text-sm textgray-gray-500">
          <input type="checkbox" name="" id="" />
          <p>Agree to the Term of Use & privacy policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {currentState === "sign-up" ? (
            <p className="text-sm text-gray-600">
              Already Have an Account?{" "}
              <span
                onClick={() => setCurrentState("Login")}
                className="font-medium tetx-violent-500 cursor-pointer"
              >
                Login here
              </span>{" "}
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create An Account?{" "}
              <span
                onClick={() => setCurrentState("sign-up")}
                className="font-medium tetx-violent-500 cursor-pointer"
              >
                Sign up
              </span>{" "}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
