require("dotenv").config()
const express=require("express");
const cors=require("cors");
const path=require("path");
const dbConnect = require("./config/db");

const app=express();

// Middleware to handle cors
app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"]
    })
)

app.use(express.json()) // by default, the req.body is undefined...so we use this middleware to see the req.body data

// Routes

const authRoutes = require("./routes/authRoute")
const sessionRoutes=require("./routes/sessionRoute")
const questionRoutes=require("./routes/questionRoute");
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplaination } = require("./controllers/aiController");


app.use("/api/auth",authRoutes)
app.use("/api/sessions",sessionRoutes)
app.use("/api/questions",questionRoutes)

// These are not GET/POST routes
app.use("/api/ai/generate-questions",protect,generateInterviewQuestions)
app.use("/api/ai/generate-explaination",generateConceptExplaination)

// connect the database
dbConnect()

// Serve upload folder
app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}))

// start server
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`server running on PORT ${PORT}`))