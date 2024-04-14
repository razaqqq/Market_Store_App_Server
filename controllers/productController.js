import { asyncError } from "../middlewares/errorMiddleware.js";
import { ProductCollection } from "../models/productModel.js";
import { UserCollection } from "../models/userModel.js";
import { CategoryCollection } from "../models/categoryModel.js"
import ErrorHandler from "../utils/errorHandler.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary"


export const getAllProducts = asyncError(
    async (req, res, next) => {

        const {keyword,category} = req.query       

        const products = await ProductCollection.find({
            name: {
                $regex:keyword ? keyword : "",
                $options: "i"
            },
            category: category ? category : undefined
        })

        res.status(200).json({
            success: true,
            products
        })
        
    }
)

export const getAllAdminProducts = asyncError(
    async (req, res, next) => {
        const products = await ProductCollection.find({}).populate("category")

        const outOfStock = products.filter(product => product.stock === 0)

        res.status(200).json({
            success: true,
            products,
            outOfStock: outOfStock.length,
            inStock: products.length - outOfStock.length
        })

    }
)

export const getProductsDetail = asyncError(
    async (req, res, next) => {


        const product = await ProductCollection.findById(req.params.productId).populate("category")

        if (!product) return next(new ErrorHandler("Product Not Found", 404))

        res.status(200).json({
            success: true,
            product
        })
        
    }
)

export const createProduct = asyncError(
    async (req, res, next) => {

        const {name,description,category,price,stock} = req.body

        if (!req.file) return next(new ErrorHandler("Please Add Image", 400))

        const file = getDataUri(req.file)
        const myCloudinaryCloud = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id:myCloudinaryCloud.public_id,
            url:myCloudinaryCloud.secure_url
        }

        await ProductCollection.create({
            name, description, category, price, stock,
            images: [image]
        })



        res.status(200).json({
            success: true,
            message: "Product Created Succesfully"
        })
        
    }
)

export const updateProduct = asyncError(
    async (req, res, next) => {

        const {name, description, category, price, stock} = req.body

        const product = await ProductCollection.findById(req.params.productId)

        if (!product) return next(new ErrorHandler("Product Not Found", 404))

        if (name) product.name = name
        if (description) product.description = description
        if (category) product.category = category
        if (price) product.price = price
        if (stock) product.stock = stock

        await product.save()

        res.status(200).json({
            success: true,
            message: "Product Update Succesfully"
        })

    }
)



export const addProductImage = asyncError(
    async (req, res, next) => {

        const product = await ProductCollection.findById(req.params.id)

        if (!product) return next(new ErrorHandler("Product Not Found", 404))

        console.log(req.file)

        if (!req.file) return next(new ErrorHandler("Please add An Image", 400))


        const file = getDataUri(req.file)
        const myCloudinary = await cloudinary.v2.uploader(file.content)

        const image = {
            public_id: myCloudinary.public_id,
            url: myCloudinary.secure_url 
        }

        product.images.push(image)

        await product.save()

        res.status(200).json({
            success: true,
            message: "Image Added Succesfully"
        })
        
    }
)


export const deleteProductImage = asyncError(
    async (req, res, next) => {

        const product = await ProductCollection.findById(req.params.imageId)

        if (!product) return next(new ErrorHandler("Product Not Found", 404))

        const id = req.query.id

        if (!id) return next(new ErrorHandler("Please Enter Image Id", 400))

        let isExist = -1

        product.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) isExist = index
        })

        if(isExist < 0) return next(new ErrorHandler("Image Doesnt Exist", 400))

        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)

        product.images.splice(isExist, 1)

        await product.save()

        res.status(200).json({
            success: true,
            message: "Image Deleted Succesfully"
        })

    }
)

export const deleteProduct = asyncError(
    async (req, res, next) => {

        

        const product = await ProductCollection.findById(req.params.productId)

        if (!product) return next(new ErrorHandler("Product Is Not Found", 404))

        for (let index = 0; index < product.images.length; index++) {
        
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
            
        }

        await product.deleteOne()

        res.status(200).json({
            success: true,
            message: "Product Has Succesfully Ddeleted"
        })

    }
)



export const addCategory = asyncError(
    async(req, res, next) => {

        await CategoryCollection.create(req.body)

        res.status(201).json({
            success: true,
            message: "New Category Has Been Created"
        })

    }
)

export const getAllCategories = asyncError(
    async(req,res,next) => {
      
        const categories = await CategoryCollection.find({})

        res.status(200).json({
            success: true,
            categories
        })

    }
)

export const deleteCategory = asyncError(
    async (req,res, next) => {

        const category = await CategoryCollection.findById(req.params.categoryId)

        if (!category) return next(new ErrorHandler("Category is Not Found", 404))

        const products = await ProductCollection.find({category: category._id})

        for (let index = 0; index < products.length; index++) {
            const product = products[index]
            product.category = undefined
            await product.save()
        }

        await category.deleteOne()

        res.status(200).json({
            success: true,
            message: "Category Has Been Deleted"
        })

    }
)