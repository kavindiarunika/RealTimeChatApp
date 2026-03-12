import {updateProfile  ,signup ,loginUser, checkAuth } from '../Controller/userController.js'
import express from 'express'
import {protectRoute} from '../middleware/auth.js'
const userroute =express.Router();

userroute.post("/signup",signup);
userroute.post("/login",loginUser);
userroute.put("/update-profile",protectRoute , updateProfile);
userroute.get("/check",protectRoute , checkAuth);

export default userroute;
