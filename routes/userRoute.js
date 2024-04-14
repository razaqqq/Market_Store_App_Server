import express from "express"
import { forgetPassword, getAllUsers, getProfile, logOut, login, register, resetPassword, updatePassword, updatePic, updateProfile } from "../controllers/userController.js"
import { isAdmin, isAuthenthicated } from "../middlewares/auth.js"
import { singleUpload } from "../middlewares/multer.js"



const router = express.Router()

router.get("/getAllUsers", isAuthenthicated, isAdmin, getAllUsers)

router.post("/login", login)
router.post("/new", singleUpload, register)
router.get("/profile", isAuthenthicated,getProfile)
router.get("/logout", isAuthenthicated,logOut)

router.put("/updateProfile", isAuthenthicated, updateProfile)
router.put("/updatePassword", isAuthenthicated, updatePassword)
router.put("/updatePic", isAuthenthicated, singleUpload, updatePic)


// Forget Password & Reset Password
router.route("/forgetPassword").post(forgetPassword).put(resetPassword)



export default router
