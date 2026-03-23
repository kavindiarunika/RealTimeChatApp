/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useEffect } from "react";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectImage, setSelectImage] = useState(null);
  const [name, setname] = useState(authUser?.fullName || "");
  const [bio, setbio] = useState(
    authUser?.bio || "hi everyone ,I am Using QuickChat",
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setname(authUser.fullName || "");
      setbio(authUser.bio || "hi everyone ,I am Using QuickChat");
    }
  }, [authUser]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log("Save button clicked, submitting form...");
    console.log("Name:", name, "Bio:", bio, "Image:", selectImage);

    if (!selectImage) {
      console.log("No image selected, updating profile without image");
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    console.log("Image selected, processing image");
    const reader = new FileReader();
    reader.readAsDataURL(selectImage);
    reader.onload = async () => {
      const based64Image = reader.result;
      console.log("Image processed, updating profile with image");
      await updateProfile({ profilePic: based64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center p-4">
      <div className="w-full max-w-4xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6">
          <form
            className="flex flex-col gap-5 w-full md:w-1/2"
            onSubmit={handlesubmit}
          >
            <h3 className="text-lg">Profile Details</h3>
            <label
              htmlFor="avatar"
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                onChange={(e) => setSelectImage(e.target.files[0])}
                type="file"
                id="avatar"
                accept=".png,.jpg,.jpeg"
                hidden
              />
              <img
                src={
                  selectImage
                    ? URL.createObjectURL(selectImage)
                    : assets.avatar_icon
                }
                alt=""
                className={`w-12 h-12 ${selectImage && "rounded-full"}`}
              />
              upload profile image
            </label>
            <input
              onChange={(e) => setname(e.target.value)}
              value={name}
              type="text"
              required
              placeholder="your name "
              className="p-2 border-gray-500 rounded-md focus:outline-none 
            focus:ring-2 focus:ring-violet-500"
            />

            <textarea
              onChange={(e) => setbio(e.target.value)}
              value={bio}
              placeholder="whrite profile bio"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 "
              rows={4}
            ></textarea>

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-3 rounded-full text-lg cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!name.trim() || !bio.trim()}
            >
              Save
            </button>
          </form>
          <div className="flex justify-center md:w-1/2">
            <img
              src={authUser?.profilePic || assets.logo_icon}
              alt=""
              className={`max-w-44 aspect-square rounded-full ${selectImage && "rounded-full"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
