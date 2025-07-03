const express = require("express");
const cors = require('cors');

const userRoutes = require('../routes/user.routes.js');
const quizRoutes = require('../routes/quiz.routes');
const questionRoutes = require('../routes/question.routes');
const categoryRoutes = require('../routes/category.routes');
const resultRoutes = require('../routes/result.routes');

const app = express();

app.use(cors());
app.use(express.json());

// User routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/results', resultRoutes);

app.get("/", (req, res) => {
    res.send("healthy");
});

module.exports = app; 