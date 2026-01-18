import React from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SideBar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-auto text-white 
      ${selectedUser ? "max-md:hidden" : ""}`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center relative">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          {/* Menu */}
          <div className="relative group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="w-5 cursor-pointer"
            />

            {/* Dropdown */}
            <div className="absolute right-0 mt-3 z-20 w-32 p-3 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-violet-400"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="cursor-pointer text-sm hover:text-red-400">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user..."
          />
        </div>
      </div>

      {/* Users list */}
      <div className="flex flex-col gap-1">
        {userDummyData.map((user, index) => (
          <div
            key={user._id || index}
            onClick={() => setSelectedUser(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
            ${
              selectedUser?._id === user._id
                ? "bg-violet-500/20"
                : "hover:bg-white/5"
            }`}
          >
            <img
              src={user.profilePic || assets.avatar_icon}
              alt="avatar"
              className="w-[35px] aspect-square rounded-full"
            />

            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {index < 3 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {index > 2 && (
              <span className="absolute top-3 right-4 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-violet-500/50">
                {index}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
