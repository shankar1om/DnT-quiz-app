const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db.js")
const userRoutes = require('./routes/user.routes.js');
const quizRoutes = require('./routes/quiz.routes');
const questionRoutes = require('./routes/question.routes');
const categoryRoutes = require('./routes/category.routes');
const resultRoutes = require('./routes/result.routes');
var cors = require('cors')


const app = express();
app.use(cors())
app.use(express.json());
const port = process.env.PORT || 8000;

// User routes

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/results', resultRoutes);

app.get("/",(req,res)=>{
    res.send("healthy")
})



app.listen(port,async()=>{
    try{
        await connectDB();
        console.log("server started on port",port)
    }
    catch(error){
        console.log("error while starting server",error)
    }
})