import React, { useEffect, useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import Loader from "../../../Components/Loading/Loader";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";


const CategoryList = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCategories();
  }, []);

  
  const getCategories = async () => {
    try {
      const res = await axios.get(
        `${url}/api/v2/category/get-categories`
      );

      setCategory(res.data.data);
    //   console.log(res.data.data);
      setLoading(false);
    } catch (error) { 
      toast.error("Please try again later");
    }
  };

  return (
    <>
      <Admin_Header />

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="categoryList py-5 mt-2">
      <Backbutton path = {'/dashboard/admin'}/>

            <h1 className="text-center mb-5">Category List</h1>

            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Categories</h5>
                      <Link
                        to="/dashboard/admin/create-category"
                        className="btn btn-primary btn-sm"
                      >
                        Add Category
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      {loading ? (
                        <div className="text-center p-4">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <table className="table table-hover table-responsive-md">
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Slug</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.length > 0 ? (
                              category.map((item) => (
                                <tr key={item._id}>
                                  <td>{item._id}</td>
                                  <td>{item.name}</td>
                                  <td>{item.slug}</td>
                                  <td>
                                    <Link
                                      to={`/dashboard/admin/edit-category/${item.slug}`}
                                      className="btn btn-primary btn-sm me-2 mb-1"
                                    >
                                      Edit
                                    </Link>

                                    <Link to={`/dashboard/admin/delete-category/${item._id}`}>
                                    <button className="btn btn-danger btn-sm mb-1">
                                      Delete
                                    </button>
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  No categories available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Toaster />


    </>
  );
};

export default CategoryList;
