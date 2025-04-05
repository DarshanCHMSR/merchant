import React, { useEffect, useState } from 'react'
import { url } from '../../../Components/backend_link/data';
import axios from 'axios';
import Admin_Header from '../Components/Admin_Header';
import Loader from '../../../Components/Loading/Loader';
import Backbutton from '../../../Components/Backbutton';
import { Link } from 'react-router-dom';

const OutofStockProducts = () => {

    const [Products, setProduct] = useState([]);
    const [Loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
      }, []);
    
    const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `${url}/api/v2/products/get-products`
          );
    
          // console.log(res.data.products);
    

          setProduct(res.data.outofstockPd);
            setLoading(false);
    
        } catch (error) {}
      };

  return (
    <>
      <Admin_Header />
      {Loading ? (
        <Loader />
      ) : (
        <>
          <div className="container mt-5">
      <Backbutton path = {'/dashboard/admin'}/>

          <h1 className="text-center mb-5 text-danger">Running out of stock</h1>

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
                  {Products.map((item) => (
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
  )
}

export default OutofStockProducts