import express from "express";
import {
  forgetPassword,
  getAllUsers,
  getProfile,
  logOut,
  login,
  register,
  resetPassword,
  updatePassword,
  updatePic,
  updateProfile,
  follow,
  unFollow,
  getUserBasedId,
  test,
} from "../controllers/userController.js";
import { isAdmin, isAuthenthicated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/getAllUsers", isAuthenthicated, isAdmin, getAllUsers);
router.post("/login", login);
router.post("/new", singleUpload, register);
router.get("/profile", isAuthenthicated, getProfile);
router.get("/userBasedId/:userId", getUserBasedId);
router.get("/logout", isAuthenthicated, logOut);
router.put("/updateProfile", isAuthenthicated, updateProfile);
router.put("/updatePassword", isAuthenthicated, updatePassword);
router.put("/updatePic", isAuthenthicated, singleUpload, updatePic);
router.route("/forgetPassword").post(forgetPassword).put(resetPassword);
router.post("/follow", isAuthenthicated, follow);
router.delete("/unFollow/:userId", isAuthenthicated, unFollow);
router.get("/test", test);

export default router;
