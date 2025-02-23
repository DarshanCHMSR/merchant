import React, { useEffect, useState } from 'react'
import Admin_Header from '../Components/Admin_Header'
import { Link } from 'react-router-dom'
import Backbutton from '../../../Components/Backbutton'
import axios from 'axios'
import { url } from '../../../Components/backend_link/data'
import Loader from '../../../Components/Loading/Loader'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const ReadVechicle = () => {


  const [loading, setLoading] = useState(false)
  
  const [vechicle, setVechicle] = useState([]);
  useEffect(() => {
    fetchVechicle();
  }, []);


  const auth = useSelector((state) => state.auth);

  const deleteVechicle = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/api/v2/vehicle/delete-vehicle/${id}`,{
          headers:{
            Authorization: auth.token
        }
      });

      fetchVechicle();
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setLoading(false);
    }
  };
    
  const fetchVechicle = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/v2/vehicle/get-vehicles`);
      setVechicle(response.data.vechicle);
      setLoading(false);
    } catch (error) {
      // console.log(error);
      toast.error("Please try again later:", error); 

      setLoading(false);
    }
  };
  
  if(loading){
    return <Loader/>
  }

  return (
    <>
    <Admin_Header/>


    <div className="container mt-5">
    <Backbutton path = {'/dashboard/admin'}/>

          <h1 className="text-center mb-5">Vechicle List</h1>
          <Link to= {'/dashboard/admin/create-vehicle'}><button className="btn btn-primary mb-3">Add a Vehicle</button></Link>
            <div className="row">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Event Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {vechicle.map((item) => (
                    <tr key={item._id}>
                      
                      <td>{item._id}</td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>
                      <Link>
                          <button className="btn btn-danger" onClick={() => deleteVechicle(item._id)}>{loading ? "Deleting..." : "Delete"}</button>
                      </Link>
                      </td>
                      <td>
                      <Link to={`/dashboard/admin/update-vehicle/${item._id}`}>
                          <button className="btn btn-success">Update</button>
                      </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

    </>
  )
}

export default ReadVechicle