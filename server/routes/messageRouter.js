import {getUserForSidebar,getMessages,markmessageAsSeen,sendMessage} from '../Controller/messageControleer.js'
import express from 'express'
import { protectRoute } from '../middleware/auth.js';


const messageroute = express.Router();

messageroute.get("/users", protectRoute, getUserForSidebar);
messageroute.get("/:id", protectRoute, getMessages);
messageroute.put("/mark/:id", protectRoute, markmessageAsSeen);
messageroute.post("/send/:id" ,protectRoute ,sendMessage);


export default messageroute;