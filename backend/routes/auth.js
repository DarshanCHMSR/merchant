import express from "express";
import {
  registerController,
  loginController,
  otpController,
  getUserController,
  otpVerification,
  updateProfileController,
  getUsersListController,
  resendOtpcontroller,
  getRateUserListController,
  getkUsers,
  deleteUser,
  resetPasswordController,
  getCustomUserId,
  updateTermsAndConditions
} from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post('/reset-password',resetPasswordController)

// * this routes is for sending the otp
router.post("/send-otp",otpController);
router.post("/verify",otpVerification);
router.post('/resend-otp',resendOtpcontroller)

// * this route is for finding the user by id 
router.get('/get-user/:id',requireSignin,getUserController)

// * This routes is for user profile update.
router.put('/update-user/:id',requireSignin,updateProfileController)

// * This routes is for user profile update.
router.delete('/delete-user/:id',requireSignin,deleteUser)

// * this route is getting all users
router.get('/get-users',getUsersListController);
router.get('/get-k-users',getkUsers)

// * this route is for updating the terms and conditions
router.put('/update-terms-and-conditions/:id',requireSignin,updateTermsAndConditions)

// * this route is finding those who are rated the product
router.get('/get-rated-user/:id',getRateUserListController)


// * this route is for checking if the user is authenticated
router.get("/userAuth", requireSignin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get('/adminAuth' , requireSignin, isAdmin,(req,res) =>{
  res.status(200).send({ok:true})
})

router.get('/get-custom-user-id',getCustomUserId) 

export default router;
