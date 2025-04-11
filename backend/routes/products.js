import express from "express";
import { requireSignin,isAdmin } from "../middleware/authMiddleWare.js";
import { fetchAllProducts ,fetchUserProduct} from "../controllers/productController.js";
import { createProduct,viewUserProducts,getkProductsView,getProductsWaiting,getProductsApproved,setProductRejStatus,searchVendors,getUsersProduct,updateProductAdmin,deleteUserProducts,getStatus,getUserProducts,getProductsByVendor,getUserTotalProducts, exportUser,setProductStatus,getProductsByDate,exportUserBylast5, deleteProduct ,getCategoryProducts, getCustomProductId, getkProducts, getProductPhoto, getProducts, getSectionOneProducts, getSectionTwoProducts, getSingleProduct, getSuggestProducts, searchAdminProducts, searchProducts, updateProduct } from "../controllers/productController.js";


const router = express.Router();
// * the routes for the downloading the products as a excel file
// * this route is used for exporting the products as a excel file till now
router.get("/export-products-till-now",exportUser,requireSignin,isAdmin);
// * this route is used for exporting the products as a excel file by the last 5 products
router.get("/exportuserbylast5",exportUserBylast5,requireSignin,isAdmin);
// * this route is used for exporting the products as a excel file by the date
router.get("/by-date", getProductsByDate, requireSignin, isAdmin);
// * this route is used for exporting the products as a excel file by the vendor name in the merchant view of the admin side
router.get("/get-products-by-vendor/:vendername", getProductsByVendor, requireSignin, isAdmin);



// * this route is used for searching the vendors by the name in the admin side this in not used in the frontend
router.get("/vendors/search/:query", searchVendors,requireSignin,isAdmin);


//the routes for the admin side merchant list
// * this route is used for deleting the user products by the user id in the admin side
router.delete("/delete-user-products/:user_id", deleteUserProducts, requireSignin, isAdmin); 
// * for fetching all the products  
router.get("/fetchallproducts", requireSignin, fetchAllProducts,isAdmin);
// * this route is used for getting the products waiting for approval by the user id in the admin side
router.get("/get-products-waiting/:user_id", getProductsWaiting, requireSignin);
// * this route is used for getting the products approved by the user id in the admin side
router.get("/get-products-approved/:user_id", getProductsApproved, requireSignin);
// * this route is used for getting the total products based on the user id
router.get("/fetchtotal/:user_id", getUserTotalProducts,requireSignin);



// * for fetching the user products for the view based on the merchant id with the pagination 
router.get("/viewkproducts/:user_id", getkProductsView,requireSignin,isAdmin);
// * for fetching the user products for the view based on the merchant id
router.get("/view-user-products/:user_id", viewUserProducts,requireSignin,isAdmin);
//for fetching the products based on the user id
router.get("/get-users-product/:user_id", getUsersProduct,requireSignin); 


  // * for creating the product used for both admin and merchant side creating the product
  router.post('/create-product',requireSignin,createProduct);


  //the routes used for the status opearions
  // * for setting the product status
router.put("/set-product-status/:id", setProductStatus,requireSignin,isAdmin);
// * for setting the product status for the rejected products
router.put("/set-product-rej-status/:id", setProductRejStatus,requireSignin,isAdmin);
  // * for getting the status
router.get("/get-status", getStatus);
//this is used for getting products based on the id
router.get('/get-single-product/:id',getSingleProduct);



  // * for getting the products
router.get('/get-products',getProducts);
// this is used for getting photo
router.get('/get-product-photo/:pid',getProductPhoto);
// this is used for updating the products based on the id
router.put('/update-product-admin/:id',requireSignin,isAdmin  ,updateProductAdmin);
//this is used for the deleting the products based on the id
router.delete('/delete-product/:id',requireSignin ,isAdmin, deleteProduct);



//this is used for the search the product based on the keyword
router.get('/search/:keyword',searchProducts);

// * fetching the products based on section
router.get('/section-one',getSectionOneProducts);
router.get('/section-two',getSectionTwoProducts);

// * fetching the products for pagination in the admin side product list
router.get('/get-k-products',getkProducts,requireSignin,isAdmin);
// * fetching the product based on category
router.get('/get-product-by-category/:id',getCategoryProducts);
// * This function is used to search the products for the admin by the customid
router.post('/search-admin-product',requireSignin  ,searchAdminProducts);

// * this router is for checking the existing product custom id
router.get('/get-customid',requireSignin ,getCustomProductId);

// * this route is used for suggesting the products on the search bar.
router.get('/suggest-product/:keyword',getSuggestProducts);



//routes that are only used for merchant side
// * for fetching the products based on the user id 
router.get("/fetch", requireSignin, getUserProducts);
// * this route is used for exporting the products as a excel file by user id in the merchant side products list page for there downloading the products
router.get("/fetchuserproducts", requireSignin, fetchUserProduct);
// * for updating the product
router.put('/update-product/:id',requireSignin  ,updateProduct);
  export default router;