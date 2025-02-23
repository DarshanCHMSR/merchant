import React, { useState } from 'react';
import Admin_Header from '../Components/Admin_Header';
import toast from 'react-hot-toast';
import axios from 'axios';
import { url } from '../../../Components/backend_link/data';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateLabour = () => {
  const [labor, setLabor] = useState({
    name: "",
    imageLink: [""], // Initialize with one empty string to start with one input field
  });

  const [loading, setLoading] = useState(false);

  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "imageLink") {
      const updatedLinks = [...labor.imageLink];
      updatedLinks[index] = value;
      setLabor({
        ...labor,
        imageLink: updatedLinks,
      });
    } else {
      setLabor({
        ...labor,
        [name]: value,
      });
    }
  };

  const addImageLinkField = () => {
    setLabor({
      ...labor,
      imageLink: [...labor.imageLink, ""],
    });
  };

  const removeImageLinkField = (index) => {
    const updatedLinks = [...labor.imageLink];
    updatedLinks.splice(index, 1);
    setLabor({
      ...labor,
      imageLink: updatedLinks,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${url}/api/v2/labour/create-labour`,
        {
          name: labor.name,
          image: JSON.stringify(labor.imageLink),
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (res.data) {
        toast.success(res.data.message);
        setLabor({
          name: "",
          imageLink: [""],
        });
        navigate('/dashboard/admin/labour-list');
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to create labor.");
      setLoading(false);
    }
  };

  return (
    <>
      <Admin_Header />
      <div className="container mt-5 p-5">
        <h3 className="mb-4 text-center">Add Labor</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={labor.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="imageLink" className="form-label">
              Image Links
            </label>
            {labor.imageLink.map((link, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control"
                  id={`imageLink-${index}`}
                  name="imageLink"
                  value={link}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                {labor.imageLink.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => removeImageLinkField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addImageLinkField}
            >
              Add Image Link
            </button>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              {loading ? "Loading..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateLabour;
