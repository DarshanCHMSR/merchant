import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { url } from '../../Components/backend_link/data';

const UpdateUserProfile = () => {
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/auth/get-user/${auth?.user?._id}`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      console.log(res.data.user)
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${url}/api/v2/auth/update-user/${auth?.user?._id}`, user, {
        headers: {
          Authorization: auth?.token,
        },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.log(error);
      alert('Something went wrong while updating the profile.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className='mb-3 text-center'>Update Profile</h2>
      <form onSubmit={handleSubmit} className='container'>
        <div className="mb-3 ">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={user.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className='d-flex align-items-center justify-content-center mb-3'>
        <button type="submit" className="btn btn-primary align-self-center">Update Profile</button>

        </div>
      </form>
    </div>
  );
};

export default UpdateUserProfile;
