import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Loading/Loader";
import Admin_Header from "../Components/Admin_Header";
import Backbutton from "../../../Components/Backbutton";
import { url } from "../../../Components/backend_link/data";


const MerchantList = () => {
  const [loading, setLoading] = useState(false);
const [users, setUsers] = useState([]);
const [filter, setFilter] = useState({
    role: false,
});
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {

      const res = await axios.get(`${url}/api/v2/auth/get-users`);
      setUsers(res.data.users);
users=res.data.users;


    } catch (error) {
      setLoading(false);
    }
  };
  
//   const filteredProducts = users.filter((item) => {
//     const matchesrole = filter.role ? item.role === 1 : true; 

//     return matchesrole; ;
//   });

  return (
    <>
      <Admin_Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mt-5">
          <div className="row mb-0">
            <div className="col-12">
              <Backbutton path={"/dashboard/admin"} />
            </div>
          </div>
                

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      
                      <th>Merchant Name</th>
                      <th>Merchant email</th>
                        <th>Merchant Phone</th>
                        {/* <th>Merchant Address</th> */}
                     <th>Merchant address</th>
                     <th>Merchant Shop Name</th>


                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.address}</td>
                        <td>{item.shop}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default MerchantList;
