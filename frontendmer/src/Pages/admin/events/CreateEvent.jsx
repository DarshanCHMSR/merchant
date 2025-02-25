import React, { useState } from 'react';
import Admin_Header from '../Components/Admin_Header';
import toast from 'react-hot-toast';
import axios from 'axios';
import { url } from '../../../Components/backend_link/data';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UploadToS3 } from '../../../State/uploadToS3'; // Import the UploadToS3 function

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        name: '',
        originalPrice:'',
        price: '',
        description: '',
    });

    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    let productImages = []; // Declare a variable to hold the product images

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProductImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        productImages = [...productImages, ...files]; // Update the productImages variable
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let productImgURL = [];
            if (productImages.length > 0) {
                productImgURL = await UploadToS3(productImages, "Event-Images"); // Upload images to S3
            }

            const res = await axios.post(`${url}/api/v2/event/create-event`, {
                name: formData.name,
                price: formData.price,
                originalPrice:formData.originalPrice,
                description: formData.description,
                image: JSON.stringify(productImgURL), // Send the uploaded image URLs
            }, {
                headers: { Authorization: auth.token }
            });

            if (res.data.success) {
                setTimeout(() => {
                    setLoading(false);
                    toast.success(res.data.message);
                    navigate('/dashboard/admin/event-list');
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
            setLoading(false);
        }   
    };

    return (
        <>
            <Admin_Header className="mb-5" />
            <div className="container mb-5 p-5">
                <form onSubmit={handleSubmit} className='mt-5'>
                    <div className="mt-5 mb-3">
                        <label htmlFor="name" className="form-label">Event Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">MRP</label>
                        <input
                            type="number"
                            className="form-control"
                            id="originalPrice"
                            name="originalPrice"
                            value={formData.originalPrice}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Discount Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Product Images</label>
                        <input
                            type="file"
                            className="form-control"
                            multiple
                            onChange={handleProductImagesUpload} // Handle file input changes
                            required
                        />
                    </div>

                    <div className='d-flex justify-content-center'>
                        <button type="submit" className="btn btn-primary">{loading ? "Loading..." : "Create Event"}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateEvent;