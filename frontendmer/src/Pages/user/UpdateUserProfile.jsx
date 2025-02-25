import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../Components/backend_link/data";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast'

const UpdateUserProfile = () => {
  const auth = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [mailPassword, setMailPassword] = useState("");
  const [confirmMailPass, setConfirmMailPass] = useState("");

  const [loading, setLoading] = useState(false);

  const [isreset, setIsreset] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${url}/api/v2/auth/get-user/${auth?.user?._id}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      const user = res.data.user;
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(user.address);
    } catch (error) {
      toast.error("Error fetching user details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmMailPass !== mailPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = {
      name,
      email,
      phone,
      address,
      mailPassword,
    };

    try {
      const res = await axios.put(
        `${url}/api/v2/auth/update-user/${auth?.user?._id}`,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          emailPassword: data.mailPassword,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if(res){
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      alert("Something went wrong while updating the profile.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3 text-center">Update Profile</h2>
      <form onSubmit={handleSubmit} className="container">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!auth?.user.email}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <Link
            to=""
            className="text-primary"
            onClick={() => setIsreset(!isreset)}
          >
            Change Password
          </Link>
          <small className="text-danger mx-2">
            [This password is used to login using your mail]
          </small>
        </div>
        {isreset && (
          <>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={mailPassword}
                onChange={(e) => setMailPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmMailPass}
                onChange={(e) => setConfirmMailPass(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="d-flex align-items-center justify-content-center mt-3 mb-3">
          <button type="submit" className="btn btn-primary align-self-center">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserProfile;
