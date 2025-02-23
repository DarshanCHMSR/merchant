import React, { useState } from 'react'
import Admin_Header from '../Components/Admin_Header';
import toast from 'react-hot-toast';
import axios from 'axios';
import { url } from '../../../Components/backend_link/data';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: [''],
      });
    
      const navigate = useNavigate();
      const auth = useSelector((state) => state.auth);

      const [loading, setLoading] = useState(false);

      const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name === "image") {
          const updatedLinks = [...formData.image];
          updatedLinks[index] = value;
          setFormData({ ...formData, image: updatedLinks });
        } else {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      };
    
      const handleAddLink = () => {
        setFormData({
          ...formData,
          image: [...formData.image, ''],
        });
      };
    
      const handleRemoveLink = (index) => {
        const updatedLinks = formData.image.filter((_, i) => i !== index);
        setFormData({
          ...formData,
          image: updatedLinks,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission here, e.g., send data to backend

        setLoading(true);

        try {
            const res  = await axios.post(`${url}/api/v2/event/create-event`, {
                name: formData.name,
                price: formData.price,
                description: formData.description,
                image: JSON.stringify(formData.image)
            }, {headers: {Authorization: auth.token}});
            
            if(res.data.success){
                setTimeout(() => {
                    setLoading(false);
                    toast.success(res.data.message);
                    navigate('/dashboard/admin/event-list');
                }, 1000);
            }
        } catch (error) {
            console.log(error);
            toast(res.data.message);
        }
        console.log(formData);
      };

  return (
    <>
    <Admin_Header className ="mb-5"/>
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
        <label htmlFor="price" className="form-label">Price</label>
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
        <label className="form-label">Image Links</label>
        {formData.image.map((link, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              name="image"
              value={link}
              onChange={(e) => handleChange(e, index)}
              placeholder={`Image Link ${index + 1}`}
              required
            />
            {formData.image.length > 1 && (
              <button
                type="button"
                className="btn btn-danger ms-2"
                onClick={() => handleRemoveLink(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddLink}
        >
          Add Another Image Link
        </button>
      </div>

      <div className='d-flex justify-content-center'>
      <button type="submit" className="btn btn-primary">{loading ? "Loading..." : "Create Event"}</button>

      </div>

    </form>
       </div>
    </>
  )
}

export default CreateEvent