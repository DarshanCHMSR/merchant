import React, { useEffect, useState } from "react";

import Signup from "./Pages/auth/Signup";
import ProductPage from "./Pages/ProductPage";
import ProductView from "./Pages/ProductView";
import Checkout from "./Pages/Checkout";

// ! When we depoly our app this should be removed.
// import Testing from "./Pages/Testing";  

import Login from "./Pages/auth/Login";
import UserPrivate from "./Components/Private_Routes/UserPrivate";
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
import DeleteProduct from "./Pages/admin/Products/DeleteProduct";
import UpdateProduct from "./Pages/admin/Products/UpdateProduct";
import SearchPage from "./Pages/SearchPage";
import RegisterForm from "./Pages/RegisterForm";
import Footer from "./Pages/Footer";


import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "./State/auth_action";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategoryBased from "./Pages/CategoryBased";
import Review from "./Pages/admin/Review";
import AdminSearchPage from "./Pages/admin/Components/AdminSearchPage";
import { fetchCart } from "./State/cart_actions";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import OutofStockProducts from "./Pages/admin/Products/OutofStockProducts";
import UserList from "./Pages/admin/user-data/UserList";
import BulkCreateProduct from "./Pages/admin/Products/BulkCreateProduct";


//merchant Merchant
import CreateProductMerchant from "./Pages/merchant/Products/CreateProduct";
import AdminDashboardMerchant from "./Pages/merchant/AdminDashboard";
import CategoryListMerchant from "./Pages/merchant/Cateogry/CategoryList";
import CreateCategoryMerchant from "./Pages/merchant/Cateogry/CreateCategory";
import UpdateCateogryMerchant from "./Pages/merchant/Cateogry/UpdateCategory";
import DeleteCategoryMerchant from "./Pages/merchant/Cateogry/DeleteCategory";
import DeleteProductMerchant from "./Pages/merchant/Products/DeleteProduct";
import UpdateProductMerchant from "./Pages/merchant/Products/UpdateProduct";
import AdminSearchPageMerchant from "./Pages/merchant/Components/AdminSearchPage";
import OutofStockProductsMerchant from "./Pages/merchant/Products/OutofStockProducts";
import UserListMerchant from "./Pages/merchant/user-data/UserList";
import BulkCreateProductMerchant from "./Pages/merchant/Products/BulkCreateProduct";
import ProductListMerchant from "./Pages/merchant/Products/ProductList";
import RegistrationForm from "./Pages/RegistrationForm";
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
<Route path="dashboard" >
              <Route path="merchant" element={<ProductListMerchant />} />
              <Route
                path="merchant/search-products/:searchValue"
                element={<AdminSearchPageMerchant />}
              />

              <Route path = 'merchant/user-list' element = {<UserListMerchant/>} />
              // ! Category routes
              <Route path="merchant/category-list" element={<CategoryListMerchant />} />
              <Route
                path="merchant/create-category"
                element={<CreateCategoryMerchant />}
              />
              <Route
                path="merchant/edit-category/:slug"
                element={<UpdateCateogryMerchant />}
              />
              <Route
                path="merchant/delete-category/:id"
                element={<DeleteCategoryMerchant />}
              />
              <Route path="merchant/register-form" element={<RegisterForm />} />
              <Route path="merchant/footer" element={<Footer />} />


              // ! Product routes
              <Route path="merchant/product-list" element={<ProductListMerchant />} />
              <Route path="merchant/create-product" element={<CreateProductMerchant />} />
              <Route
                path="merchant/update-product/:id"
                element={<UpdateProductMerchant />}
              />
              <Route
                path="merchant/delete-product/:id"
                element={<DeleteProductMerchant />}
              />
              <Route
                path="merchant/outofstock-products"
                element={<OutofStockProductsMerchant />}
              />

            </Route>
            <Route path = 'dashboard/merchant/bulk-upload' element = {<BulkCreateProductMerchant/>}/>  


            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <Login />
          
              }
            />
            <Route
              path="/registration-form"
              element={
                <RegistrationForm />
          
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
                  <h1>Book Ride</h1>
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
