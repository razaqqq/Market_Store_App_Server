
import express from "express"
import {config} from "dotenv"

// Importing Routers Here
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import orderRoute  from "./routes/orderRoute.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
import cookieParser from "cookie-parser"
import cors from "cors"


config({
    path:"./data/config.env"
})

export const app = express()

// Using Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: [
        process.env.FRONT_END_URI_1,
        process.env.FRONT_END_URI_2
    ]
}))

app.get("/", (req, res, next) => {
    res.send("Working")
})


app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoute)


// Using Error Handler Middleware
app.use(errorMiddleware)