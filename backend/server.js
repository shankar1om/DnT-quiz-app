const app = require('./config/app');
require("dotenv").config();
const connectDB = require("./config/db.js")

const port = process.env.PORT || 8010;

app.listen(port, async () => {
    try {
        await connectDB();
        console.log("server started on port", port);
    } catch (error) {
        console.log("error while starting server", error);
    }
});