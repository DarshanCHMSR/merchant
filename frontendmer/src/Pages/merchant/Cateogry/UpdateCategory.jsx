import React, { useEffect, useState } from 'react';
import Admin_Header from '../Components/Admin_Header';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../../Components/Loading/Loader';
import Backbutton from '../../../Components/Backbutton';
import { url } from '../../../Components/backend_link/data';
import { UploadToS3 } from '../../../State/uploadToS3'; // Import the UploadToS3 function

const UpdateCategory = () => {
  const { slug } = useParams();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); // Change to null for better handling
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleImageUpload = async () => {
    if (image) {
      const imageUrl = await UploadToS3([image], "Category-Images"); // Upload the image
      return imageUrl[0]; // Return the first URL
    }
    return null; // No image uploaded
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    try {
      const uploadedImageUrl = await handleImageUpload(); // Upload image and get URL
      const res = await axios.put(
        `${url}/api/v2/category/update-category/${id}`,
        { name, image: uploadedImageUrl || image }, // Include the uploaded image URL or existing image
        {
          headers: {
            Authorization: auth?.token // Include headers in the config object
          }
        }
      );

      // console.log(res.data);
      setTimeout(() => {
        setLoading(false);
        toast.success(res.data.message);
        navigate('/dashboard/admin/category-list');
      }, 1000);
    } catch (error) {
      // console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const getSingleCategory = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/category/get-category/${slug}`);
      // console.log(res.data.data);
      setId(res.data.category._id);
      setName(res.data.category.name);
      setImage(res.data.category.image || ''); // Set existing image
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getSingleCategory();
  }, [slug]);

  return (
    <>
      <Admin_Header />
      <Toaster />
      <div className="container" style={{ marginTop: '10vh' }}>
        <Backbutton path={'/dashboard/admin/category-list'} />
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
                    <label htmlFor="image" className="form-label">Category Image</label>
                    <input
                      type="file"
                      className="form-control form-control-lg"
                      id="image"
                      accept="image/*" // Restrict to image files
                      onChange={(e) => setImage(e.target.files[0])} // Set the selected file
                    />
                  </div>

                  {/* Display existing image if available */}
                  {image && (
                    <div className="mb-3">
                      <img
                        src={image} // Create a URL for the selected file
                        alt="Selected Category"
                        className="img-fluid mb-3 object-fit-contain"
                        style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  {image === null && (
                    <div className="mb-3">
                      <img
                        src={image} // Display the existing image
                        alt="Current Category"
                        className="img-fluid mb-3"
                        style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  )}

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
