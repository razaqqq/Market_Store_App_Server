
import { asyncError } from "../middlewares/errorMiddleware.js";
import { OrderCollection } from "../models/orderModel.js"
import { ProductCollection } from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import {stripe} from "../server.js"

export const processPayment = asyncError(
    async(req,res,next) => {

        const {totalAmount} = req.body

        const {client_secret} = await stripe.paymentIntents.create({
            amount: Number(totalAmount*100),
            currency: "inr"
        })

        res.status(200).json({
            success: true,
            client_secret
        })

    }
)

export const createNewOrder = asyncError(
    async (req, res, next) => {
        const {
            shippingInfo, 
            orderItems, 
            paymentMethods, 
            paymentInfo, 
            itemsPrice, 
            taxPrice, 
            shippingCharges,
            totalAmount
        } = req.body

        await OrderCollection.create({
            user: req.user._id,
            shippingInfo, 
            orderItems, 
            paymentMethods, 
            paymentInfo, 
            itemsPrice, 
            taxPrice, 
            shippingCharges,
            totalAmount
        })

        for (let index = 0; index < orderItems.length; index++) {
            
            const product = await ProductCollection.findById(orderItems[index].product)

            product.stock -= orderItems[index].quantity

            await product.save()
            
        }

        res.status(200).json({
            success: true,
            message: "New Order Hasbeen Created"
        })

    }
)

export const getMyOrders = asyncError(
    async (req, res, next) => {
        const orders = await OrderCollection.find({user:req.user._id})
        
        res.status(200).json({
            success: true,
            orders
        })

    }
)

export const getOrdersDetail = asyncError(


    async (req, res, next) => {

        const order = await OrderCollection.findById(req.params.orderId)

        if (!order) return next(new ErrorHandler("Order Not Found", 404))


        res.status(200).json({
            success: true,
            order
        })
    }
)

export const processOrder = asyncError(
    async (req, res, next) => {

        const order = await OrderCollection.findById(req.params.orderId)

        if (!order) return next(new ErrorHandler("Order Not Found", 404))

        if (order.orderStatus === "Preparing") order.orderStatus = "Shipped"
        else if (order.orderStatus === "Shipped") {
            order.orderStatus = "Delivered"
            order.deliveredAt = new Date(Date.now())

        }
        else return next(new ErrorHandler("Order Hass Already Delivered", 400))

        await order.save()

        res.status(200).json({
            success: true,
            message: "Order Process Succesfully"
        })

    }
)

export const getAdminOrders = asyncError(
    async (req, res, next) => {

        const adminOrders = await  OrderCollection.find({})

        res.status(200).json({
            succes: true,
            adminOrders
        })

    }
)

