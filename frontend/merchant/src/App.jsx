import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import OutofStockProductsmerchant from "./Pages/merchant/Products/OutofStockProducts";
import SectionLinksmerchant from "./Pages/merchant/sections/SectionLinks";
import LinkTablemerchant from "./Pages/merchant/sections/LinkTable";
import LabourListmerchant from "./Pages/merchant/labour/LabourList";
import CreateLabourmerchant from "./Pages/merchant/labour/CreateLabour";
import UpdateLabourmerchant from "./Pages/merchant/labour/UpdateLabour";
import Reviewmerchant from "./Pages/merchant/Review";
import AdminSearchPage from "./Pages/merchant/Components/AdminSearchPage";
import CreateVechicle from "./Pages/merchant/vechicle/CreateVechicle";
import UpdateVechicle from "./Pages/merchant/vechicle/UpdateVechicle";
import ReadVechicle from "./Pages/merchant/vechicle/ReadVechicle";
import OrderDetail from "./Pages/merchant/orders/OrderDetails";
import EventList from "./Pages/merchant/events/EventList";
import CreateEvent from "./Pages/merchant/events/CreateEvent";
import UpdateEvent from "./Pages/merchant/events/UpdateEvent";
import CategoryList from "./Pages/merchant/Cateogry/CategoryList";
import CreateCategory from "./Pages/merchant/Cateogry/CreateCategory";
import UpdateCateogry from "./Pages/merchant/Cateogry/UpdateCategory";
import DeleteCategory from "./Pages/merchant/Cateogry/DeleteCategory";
import OrderList from "./Pages/merchant/orders/OrderList";
import DeleteProduct from "./Pages/merchant/Products/DeleteProduct";
import UpdateProduct from "./Pages/merchant/Products/UpdateProduct";
import CreateProduct from "./Pages/merchant/Products/CreateProduct";
import ProductList from "./Pages/merchant/Products/ProductList";
import AdminDashboard from "./Pages/merchant/AdminDashboard";







function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Route path="dashboard" element={<Admin_Private />}>

<Route path="merchant" element={<AdminDashboardmerchant />} />

          <Route path="merchant/order-tracking" element={<OrderListmerchant />} />
          <Route path="merchant/review" element={<Reviewmerchant />} />
          <Route
            path="merchant/search-products/:searchValue"
            element={<AdminSearchPagemerchant />}
          />

          <Route path = 'merchant/user-list' element = {<UserListmerchant/>} />
          // ! Category routes
          <Route path="merchant/category-list" element={<CategoryListmerchant />} />
          <Route
            path="merchant/create-category"
            element={<CreateCategorymerchant />}
          />
          <Route
            path="merchant/edit-category/:slug"
            element={<UpdateCateogrymerchant />}
          />
          <Route
            path="merchant/delete-category/:id"
            element={<DeleteCategorymerchant />}
          />
          // ! Product routes
          <Route path="merchant/product-list" element={<ProductListmerchant />} />
          <Route path="merchant/create-product" element={<CreateProductmerchant />} />
          <Route
            path="merchant/update-product/:id"
            element={<UpdateProductmerchant />}
          />
          <Route
            path="merchant/delete-product/:id"
            element={<DeleteProductmerchant />}
          />
          <Route
            path="merchant/outofstock-products"
            element={<OutofStockProductsmerchant />}
          />

          <Route path = 'merchant/bulk-upload' element = {<BulkCreateProductmerchant/>}/>
          

          // ! Orders
          <Route path="merchant/orders" element={<OrderList />} />
          <Route
            path="merchant/orders/order-detail/:id"
            element={<OrderDetailmerchant />}
          />

          // ! Event
          <Route path="merchant/create-event" element={<CreateEventmerchant />} />
          <Route path="merchant/event-list" element={<EventListmerchant />} />
          <Route path="merchant/update-event/:id" element={<UpdateEventmerchant />} />
          // ! Vechicle
          <Route path="merchant/create-vehicle" element={<CreateVechiclemerchant />} />
          <Route
            path="merchant/update-vehicle/:id"
            element={<UpdateVechiclemerchant />}
          />
          <Route path="merchant/vehicle-list" element={<ReadVechiclemerchant />} />
          // ! Section Links
          <Route path="merchant/create-link" element={<SectionLinksmerchant />} />
          <Route path="merchant/section-links" element={<LinkTablemerchant />} />
          // ! Labour
          <Route path="merchant/labour-list" element={<LabourListmerchant />} />
          <Route path="merchant/create-labour" element={<CreateLabourmerchant />} />
          <Route
            path="merchant/update-labour/:id"
            element={<UpdateLabourmerchant />}
          />

          // ! Pincodes
          <Route path ='merchant/add-pincodes' element={<CreatePincodemerchant/>} />
          <Route path="merchant/pincodes-list" element={<GetAllPincodesmerchant />} />
        </Route>
     
    </>
  )
}

export default App
