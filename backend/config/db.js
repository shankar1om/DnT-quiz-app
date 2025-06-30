const mongoose = require("mongoose")
require('dotenv').config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connection to the DB successful")
    }
    catch(error){
        console.log("error while connecting to the DB",error)
    }
}

module.exports = connectDB;