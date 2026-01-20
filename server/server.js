import express from 'express'
import "dontenv/config";
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js';

const app = express();
const server = http.createServer(app);

//Middle app
app.use(express.json({limits:"4mb"}))
app.use(cors())

app.use("/api/status" ,(req,res) =>res.send("Server is live"))

await connectDB();
const PORT = process.nextTick.PORT ||4000;

server.listen(PORT,()=>console.log("server is running on port "+PORT))