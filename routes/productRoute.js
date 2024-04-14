import express from "express"
import { addCategory, addProductImage, createProduct, deleteCategory, deleteProduct, deleteProductImage, getAllAdminProducts, getAllCategories, getAllProducts, getProductsDetail, updateProduct } from "../controllers/productController.js"
import { isAuthenthicated, isAdmin } from "../middlewares/auth.js"
import { singleUpload } from "../middlewares/multer.js"



const router = express.Router()



router.get("/all", getAllProducts)
router.get("/admin", isAuthenthicated, isAdmin, getAllAdminProducts)

router.route("/single/:productId")
    .get(getProductsDetail)
    .put(isAuthenthicated, updateProduct)
    .delete(isAuthenthicated, isAdmin, deleteProduct)


router.post("/new", isAuthenthicated, isAdmin, singleUpload,createProduct)

router.route("/images/:id")
    .post(isAuthenthicated, isAdmin, addProductImage)
    .delete(isAuthenthicated, isAdmin, deleteProductImage)


router.post("/category",isAuthenthicated, isAdmin, addCategory)

router.get("/categories",isAuthenthicated, getAllCategories)

router.delete("/category/:categoryId",isAuthenthicated, isAdmin, deleteCategory)

export default router