import React, { useState } from "react";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SectionLinks = () => {
  const [imageLinks, setImageLinks] = useState([""]);

  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleImageLinkChange = (index, event) => {
    const newImageLinks = [...imageLinks];
    newImageLinks[index] = event.target.value;
    setImageLinks(newImageLinks);
  };

  const handleAddField = () => {
    setImageLinks([...imageLinks, ""]);
  };

  const handleRemoveField = (index) => {
    const newImageLinks = imageLinks.filter((_, i) => i !== index);
    setImageLinks(newImageLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await axios.post(`${url}/api/v2/section/section-one`, {
            image: JSON.stringify(imageLinks),
        }, {
            headers: {
                Authorization: auth.token
            }
        });

        if(res.data.success) {  
            toast.success("Section Link Added Successfully");

            setLoading(false);  
           
            navigate('/dashboard/admin/section-links')
        }

    } catch (error) {
      console.log(error);
      toast.error(res.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Admin_Header />

      <div className="container p-5 mt-5">
      <form onSubmit={handleSubmit}>
        {imageLinks.map((link, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={`imageLink-${index}`}>
              Image Link {index + 1}:
            </label>
            <div className="d-flex align-items-center">
              <input
                type="url"
                id={`imageLink-${index}`}
                className="form-control"
                placeholder="Enter image URL"
                value={link}
                onChange={(e) => handleImageLinkChange(index, e)}
                required
              />
              {imageLinks.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={() => handleRemoveField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3 mt-2"
          onClick={handleAddField}
        >
          Add Another Image Link
        </button>
        <div className="d-flex justify-content-center">
        <button type="submit" className="btn btn-primary mt-3 ">
          {
            loading ? "Loading..." : "Add Section Link"
          }
        </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default SectionLinks;
