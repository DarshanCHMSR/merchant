import jwt from "jsonwebtoken";
import express from "express";
import slugify from "slugify";
import { body, validationResult } from "express-validator";
import { comparePassword, hashPassword } from "../helpers/authEncryption.js";
import Product from "../models/productModel.js";
import { requireSignin } from "../middleware/authMiddleWare.js";
import { isAdmin } from "../middleware/authMiddleWare.js";
import { fetchAllProducts ,fetchUserProduct} from "../controllers/productController.js";
import { createProduct, deleteProduct ,getCategoryProducts, getCustomProductId, getkProducts, getProductPhoto, getProducts, getSectionOneProducts, getSectionTwoProducts, getSingleProduct, getSuggestProducts, searchAdminProducts, searchProducts, updateProduct } from "../controllers/productController.js";


const router = express.Router();

router.get("/fetchuserproducts", requireSignin, fetchUserProduct);
  router.get("/fetchallproducts", requireSignin, fetchAllProducts);
  router.post('/create-product',requireSignin,isAdmin ,createProduct);
 



  router.get('/get-products',getProducts);
  router.get('/get-single-product/:id',getSingleProduct);
router.get('/get-product-photo/:pid',getProductPhoto);

router.put('/update-product/:id',requireSignin,isAdmin ,updateProduct);

router.delete('/delete-product/:id',requireSignin,isAdmin, deleteProduct);

// * for searching of the product

router.get('/search/:keyword',searchProducts);


// * fetching the products based on section
router.get('/section-one',getSectionOneProducts);
router.get('/section-two',getSectionTwoProducts);


// * fetching the products for pagination
router.get('/get-k-products',getkProducts);


// * fetching the product based on category
router.get('/get-product-by-category/:id',getCategoryProducts);


// * This function is used to search the products for the admin by the customid
router.post('/search-admin-product',requireSignin,isAdmin ,searchAdminProducts);

// * this router is for checking the existing product custom id

router.get('/get-customid',requireSignin,isAdmin,getCustomProductId);

// * this route is used for suggesting the products on the search bar.
router.get('/suggest-product/:keyword',getSuggestProducts);



  export default router;