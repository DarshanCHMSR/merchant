import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Loading/Loader";
import Admin_Header from "../Components/Admin_Header";
import { Link } from "react-router-dom";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";


const ProductList = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${url}/api/v2/products/get-products`
      );

      setProduct(res.data.products);
      setLoading(false);

    } catch (error) {}
  };

  // console.log(product)


  return (
    <>
      <Admin_Header />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container mt-5">
      <Backbutton path = {'/dashboard/admin'}/>

          <h1 className="text-center mb-5">Product List</h1>
          <Link to= {'/dashboard/admin/create-product'}><button className="btn btn-primary mb-3">Add a Product</button></Link>
            <div className="row">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    {/* <th>Category</th> */}
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((item) => (
                    <tr key={item._id}>
                      
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td> ₹{new Intl.NumberFormat("en-IN").format(item.price)}</td>
                      {/* <td>{item.category.name}</td> */}
                      <td>{item.stock}</td>
                      <td>
                      <Link to={`/dashboard/admin/delete-product/${item._id}`}>
                          <button className="btn btn-danger">Delete</button>
                      </Link>
                      </td>
                      <td>
                      <Link to={`/dashboard/admin/update-product/${item._id}`}>
                          <button className="btn btn-success">Update</button>
                      </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductList;
