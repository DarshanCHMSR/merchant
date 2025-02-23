import React, { useEffect, useState } from 'react';
import Admin_Header from '../Components/Admin_Header';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../../Components/Loading/Loader';
import Backbutton from '../../../Components/Backbutton';
import { url } from '../../../Components/backend_link/data';

const UpdateCategory = () => {
  const {slug } = useParams();

  console.log(slug)
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    try {
      const res = await axios.put(
        `${url}/api/v2/category/update-category/${id}`,
        { name ,image }, // Only include the data to be sent in the body
        {
          headers: {
            Authorization: auth?.token // Include headers in the config object
          }
        }
      );

      console.log(res.data);
      setTimeout(() => {
      setLoading(false);
      toast.success(res.data.message);
 
      navigate('/dashboard/admin/category-list');       
      }, 1000);

    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const getSingleCategory = async() =>{
    try {
      const res = await axios.get(`${url}/api/v2/category/get-category/${slug}`);
      console.log(res.data.data);
      setId(res.data.category._id);
      setName(res.data.category.name);
      setImage(res.data.category.image || '');
      
      // console.log(res.data.category._id)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSingleCategory();
  
  }, [id])
  
  return (
    <>
      <Admin_Header />
      <Toaster />
        
              <div className="container" style={{ marginTop: '10vh' }}>
      <Backbutton path = {'/dashboard/admin/category-list'}/>

        <div className="row">
          <div className="col-lg-6 col-md-8 col-sm-10 mx-auto">
            <div className="card shadow-lg border-light rounded">
              <div className="card-body p-4">
                <h4 className="text-center mb-4">Update Category</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter category name"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Category Image Link</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Category Image link"
                    />
                  </div>

                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-lg px-4 py-2"
                      type="submit"
                      disabled={loading} // Disable button during loading
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
          
    </>
  );
};

export default UpdateCategory;
