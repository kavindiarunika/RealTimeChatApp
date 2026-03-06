import mongoose from 'mongoose'

export const connectDB =async()=>{
    try{
        mongoose.connection.on('connected' , ()=>console.log("Database connected"))
        await mongoose.connect(`${process.env.BACKEND_URL}/chatapp`)

    }
    catch(error){
        console.log(error)

    }
}