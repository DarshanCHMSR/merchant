import express from "express";
import {
  registerController,
  loginController,
  getUserController,
  updateProfileController,
  getUsersListController,
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

// * this route is for finding the user by id 
router.get('/get-user/:id',requireSignin,getUserController)
// * this route is for finding the user by id in the bank info page
router.get('/get-users/:id',getUserController)


// * This routes is for user profile update.
router.put('/update-user/:id',requireSignin,updateProfileController)

// * This routes is for user profile update.
router.delete('/delete-user/:id',requireSignin,deleteUser)

// * this route is getting all users
router.get('/get-users',getUsersListController);
router.get('/get-k-users',getkUsers)

// * this route is for updating the terms and conditions
router.put('/update-terms-and-conditions/:id',requireSignin,updateTermsAndConditions)



// * this route is for checking if the user is authenticated
router.get("/userAuth", requireSignin, (req, res) => {
  res.status(200).send({ ok: true });
});
//this is for checking if the user is admin or not
router.get('/adminAuth' , requireSignin, isAdmin,(req,res) =>{
  res.status(200).send({ok:true})
})
// * this route is for getting the custom user id
router.get('/get-custom-user-id',getCustomUserId) 

export default router;
