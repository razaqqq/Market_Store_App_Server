import { UserCollection } from "../models/userModel.js"
import ErrorHandler from "../utils/errorHandler.js"
import jwt from "jsonwebtoken"
import { asyncError } from "./errorMiddleware.js"

export const isAuthenthicated = asyncError(
    async (req,res,next) => {

        // const token = req.cookies.token
    
        console.log(req.cookies)
    
        const {token} = req.cookies
    
        if (!token) return next(new ErrorHandler("Not Loogin", 401))
    
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)

        console.log(decodedData)

    
        req.user = await UserCollection.findById(decodedData._id)
    
        next()
    
    }
)



export const isAdmin = asyncError(
    async (req, res, next) => {
        if (req.user.role !== "admin") 
            return next(new ErrorHandler("Only Admin Can Access This Featured", 401))

        next()
    }
)