import React, { useState } from 'react'
import Admin_Header from '../Components/Admin_Header'
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Backbutton from '../../../Components/Backbutton';
import { url } from '../../../Components/backend_link/data';

const CreateCategory = () => {

  const [name, setName] = useState('');

  const [image, setImage] = useState('');

  const [loading, setLoading] = useState(false);
  const naviagte = useNavigate();

const auth =  useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    setLoading(true);

    try {
      const res = await axios.post(
        `${url}/api/v2/category/create-category`,
        { name , image }, // Only include the data to be sent in the body
        {
          headers: {
            Authorization: auth?.token // Include headers in the config object
          }
        }
      );

      setTimeout(() => {
        toast.success(res.data.message);
        setLoading(false);
        naviagte('/dashboard/admin/category-list');
      }, 1000);

      console.log(res.data);  

    } catch (error) {
      console.log(error);
    }

  };



  return (
    <>
    <Admin_Header/>

    <div className="container" style={{ marginTop: '10vh' }}>
    <Backbutton path = {'/dashboard/admin/category-list'}/>

        <div className="row">
          <div className="col-lg-6 col-md-8 col-sm-10 mx-auto">
            <div className="card shadow-lg border-light rounded">
              <div className="card-body p-4">
                <h4 className="text-center mb-4">Create Category</h4>
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
                      placeholder="Enter category name"
                    />
                  </div>


                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-lg px-4 py-2"
                      type="submit"
                      disabled={loading} // Disable button during loading
                    >
                      {loading ? 'Adding...' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </>
  )
}

export default CreateCategory