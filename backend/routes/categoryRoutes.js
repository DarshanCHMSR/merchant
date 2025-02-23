import express from "express";
import { createCategory, deleteCategory, getCategories, getSingleCategory, updateCategory } from "../controllers/categoryController.js";
import { isAdmin, requireSignin } from "../middleware/authMiddleware.js";

const router = express.Router();

// * Category routes
router.post('/create-category',requireSignin ,isAdmin,createCategory)
router.get('/get-categories', getCategories)
router.get('/get-category/:slug',getSingleCategory)
router.put('/update-category/:id', requireSignin,isAdmin,updateCategory)
router.delete('/delete-category/:id',requireSignin,isAdmin,deleteCategory)


export default router