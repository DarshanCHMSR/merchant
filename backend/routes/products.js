import jwt from "jsonwebtoken";
import express from "express";
import slugify from "slugify";
import { body, validationResult } from "express-validator";
import { comparePassword, hashPassword } from "../helpers/authEncryption.js";
import Product from "../models/productModel.js";
import { requireSignin } from "../middleware/authMiddleWare.js";
import { isAdmin } from "../middleware/authMiddleWare.js";
import { fetchAllProducts ,fetchUserProduct} from "../controllers/productController.js";
import { createProduct,setProductRejStatus,searchVendors,getUsersProduct,updateProductAdmin,deleteUserProducts,getStatus,getUserProducts,getProductsByVendor,getUserTotalProducts, exportUser,setProductStatus,getProductsByDate,exportUserBylast5, deleteProduct ,getCategoryProducts, getCustomProductId, getkProducts, getProductPhoto, getProducts, getSectionOneProducts, getSectionTwoProducts, getSingleProduct, getSuggestProducts, searchAdminProducts, searchProducts, updateProduct } from "../controllers/productController.js";


const router = express.Router();
// * for exporting the user
router.get("/exportuser",exportUser);
router.get("/exportuserbylast5",exportUserBylast5);
router.get("/by-date", getProductsByDate);
router.get("/get-products-by-vendor/:vendername", getProductsByVendor);
router.get("/fetchuserproducts", requireSignin, fetchUserProduct);
router.get("/vendors/search/:query", searchVendors);

// * for fetching the user products
router.get("/fetch", requireSignin, getUserProducts);
router.get("/fetchtotal/:user_id", getUserTotalProducts);
router.delete("/delete-user-products/:user_id", deleteUserProducts);
router.get("/get-users-product/:user_id", getUsersProduct); 

// * for fetching all the products  
  router.get("/fetchallproducts", requireSignin, fetchAllProducts);
  router.post('/create-product',requireSignin  ,createProduct);
router.put("/set-product-status/:id", setProductStatus);
router.put("/set-product-rej-status/:id", setProductRejStatus);
router.get("/get-status", getStatus);
  // * for getting the products
  router.get('/get-products',getProducts);
  router.get('/get-single-product/:id',getSingleProduct);
router.get('/get-product-photo/:pid',getProductPhoto);
// * for updating the product
router.put('/update-product/:id',requireSignin  ,updateProduct);
router.put('/update-product-admin/:id',requireSignin  ,updateProductAdmin);


router.delete('/delete-product/:id',requireSignin , deleteProduct);

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
router.post('/search-admin-product',requireSignin  ,searchAdminProducts);

// * this router is for checking the existing product custom id

router.get('/get-customid',requireSignin ,getCustomProductId);

// * this route is used for suggesting the products on the search bar.
router.get('/suggest-product/:keyword',getSuggestProducts);



  export default router;