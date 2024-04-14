import express from 'express'
import { createNewOrder, getAdminOrders, getMyOrders, getOrdersDetail, processOrder, processPayment } from '../controllers/orderController.js'
import { isAdmin, isAuthenthicated } from '../middlewares/auth.js'

const router = express.Router()

router.post("/new", isAuthenthicated, createNewOrder)
router.post("/payment", isAuthenthicated, processPayment)

router.get("/myOrder", isAuthenthicated,getMyOrders)
router.get("/adminOrder", isAuthenthicated, isAdmin, getAdminOrders)


router.route("/single/:orderId")
    .get(isAuthenthicated, getOrdersDetail)
    .put(isAuthenthicated, isAdmin,processOrder)

export default router
