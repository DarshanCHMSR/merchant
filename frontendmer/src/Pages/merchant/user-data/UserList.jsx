import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Admin_Header from "../Components/Admin_Header";
import axios from "axios";
import { url } from "../../../Components/backend_link/data";
import Loader from "../../../Components/Loading/Loader";
import Backbutton from "../../../Components/Backbutton";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setusers] = useState([]);
  const auth = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/v2/auth/get-users`, {
        headers: {
          Authorization: auth.token,
        },
      });

      if (res.data.success) {
        setusers(res.data.users);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Admin_Header />

      <div className="container mt-5">
        <Backbutton path={"/dashboard/admin"} />

        <h1 className="text-center mb-5">Users List</h1>
        <div className="row">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>User Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserList;
