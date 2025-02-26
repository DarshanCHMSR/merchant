import React, { useEffect, useState } from "react";

import Signup from "./Pages/auth/Signup";
import ProductPage from "./Pages/ProductPage";
import ProductView from "./Pages/ProductView";
import Checkout from "./Pages/Checkout";

// ! When we depoly our app this should be removed.
// import Testing from "./Pages/Testing";  

import Login from "./Pages/auth/Login";
import UserPrivate from "./Components/Private_Routes/UserPrivate";
import { Ride } from "./Pages/ride/Ride";
import Admin_Private from "./Components/Private_Routes/Admin_Private";
import CreateProduct from "./Pages/admin/Products/CreateProduct";
import ProductList from "./Pages/admin/Products/ProductList";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import Loader from "./Components/Loading/Loader";
import Layout from "./Components/Layout";
import CategoryList from "./Pages/admin/Cateogry/CategoryList";
import CreateCategory from "./Pages/admin/Cateogry/CreateCategory";
import UpdateCateogry from "./Pages/admin/Cateogry/UpdateCategory";
import DeleteCategory from "./Pages/admin/Cateogry/DeleteCategory";
import OrderList from "./Pages/admin/orders/OrderList";
import DeleteProduct from "./Pages/admin/Products/DeleteProduct";
import UpdateProduct from "./Pages/admin/Products/UpdateProduct";
import SearchPage from "./Pages/SearchPage";
import OrderDetail from "./Pages/admin/orders/OrderDetails";


import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "./State/auth_action";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReadVechicle from "./Pages/admin/vechicle/ReadVechicle";
import CategoryBased from "./Pages/CategoryBased";
import SectionLinks from "./Pages/admin/sections/SectionLinks";
import LinkTable from "./Pages/admin/sections/LinkTable";
import Review from "./Pages/admin/Review";
import AdminSearchPage from "./Pages/admin/Components/AdminSearchPage";
import { fetchCart } from "./State/cart_actions";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import OutofStockProducts from "./Pages/admin/Products/OutofStockProducts";
import UserList from "./Pages/admin/user-data/UserList";
import UpdateUserProfile from "./Pages/user/UpdateUserProfile";
import GetAllPincodes from "./Pages/admin/pincode/GetAllPincodes";
import CreatePincode from "./Pages/admin/pincode/CreatePincode";
import BulkCreateProduct from "./Pages/admin/Products/BulkCreateProduct";


//merchant 
import ProductListMerchant from "./Pages/merchant/Products/ProductList";
function App() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const data = localStorage.getItem("auth-Data");
    if (data) {
      const parseData = JSON.parse(data);
      dispatch(
        setAuth({
          user: parseData.user,
          token: parseData.token,
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (auth?.user) {
      setLoading(true);
      
      dispatch(fetchCart(auth?.user._id));
      setLoading(false);
    }

  }, []);

  
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Router>
          {/* <Header /> */}

          <Routes>
            // ? Private Routes for user
            <Route
              path="dashboard"
              element={
                <Layout>
                  <UserPrivate />
                </Layout>
              }
            >
            </Route>


            // ? Private routes for admin
            <Route path="dashboard" element={<Admin_Private />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/order-tracking" element={<OrderList />} />
              <Route path="admin/review" element={<Review />} />
              <Route
                path="admin/search-products/:searchValue"
                element={<AdminSearchPage />}
              />

              <Route path = 'admin/user-list' element = {<UserList/>} />
              // ! Category routes
              <Route path="admin/category-list" element={<CategoryList />} />
              <Route
                path="admin/create-category"
                element={<CreateCategory />}
              />
              <Route
                path="admin/edit-category/:slug"
                element={<UpdateCateogry />}
              />
              <Route
                path="admin/delete-category/:id"
                element={<DeleteCategory />}
              />


              // ! Product routes
              <Route path="admin/product-list" element={<ProductList />} />
              <Route path="admin/create-product" element={<CreateProduct />} />
              <Route
                path="admin/update-product/:id"
                element={<UpdateProduct />}
              />
              <Route
                path="admin/delete-product/:id"
                element={<DeleteProduct />}
              />
              <Route
                path="admin/outofstock-products"
                element={<OutofStockProducts />}
              />

              <Route path = 'admin/bulk-upload' element = {<BulkCreateProduct/>}/>
              

           
              
            </Route>

            // * Public Routes
            <Route
              path="/category-products/:id"
              element={
                <Layout>
                  <CategoryBased />
                </Layout>
              }
            />

//Merchant Routes
            <Route path="merchant/product-list" element={<ProductListMerchant />} />


            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <ProductListMerchant />
          
              }
            />
            <Route
              path="/product/:id"
              element={
                <Layout>
                  <ProductPage />
                </Layout>
              }
            />
            

            // * this route is product list page
            <Route
              path="/productView"
              element={
                <Layout>
                  <ProductView />
                </Layout>
              }
            />
            <Route
              path="/checkout"
              element={
                <Layout>
                  <Checkout />
                </Layout>
              }
            />
           
            <Route path="/login" element={<Login />} />
            <Route
              path="/book-ride"
              element={
                <Layout>
                  <Ride />
                </Layout>
              }
            />




            <Route
              path="/search"
              element={
                <Layout>
                  <SearchPage />{" "}
                </Layout>
              }
            />
            <Route
              path="/about-us"
              element={
                <Layout>
                  <AboutUs />
                </Layout>
              }
            />
            <Route
              path="contact-us"
              element={
                <Layout>
                  <ContactUs />
                </Layout>
              }
            />
            {/* These path for my testing purpose */}
            <Route
              path="/testing"
              // element={
              //   <Layout>
              //     <Testing />
              //   </Layout>
              // }
            />
          </Routes>

          {/* <Footer /> */}
        </Router>
      )}
    </>
  );
}

export default App;
