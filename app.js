import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

const connectdb = async()=>{
    try{

        await mongoose.connect(process.env.MONGO_URI)
        console.log('Sucessfully connected to MongoDB')
    }catch(e){
        console.error(e)
        process.exit(1)
    }

}

const startServer = async()=>{
    await connectdb()
    app.listen(PORT, ()=>{
    console.log(`The server is running on PORT ${PORT}`)
})
}

startServer()
