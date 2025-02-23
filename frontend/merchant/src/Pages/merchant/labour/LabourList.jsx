import React, { useEffect, useState } from 'react'
import Admin_Header from '../Components/Admin_Header'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { url } from '../../../Components/backend_link/data'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const LabourList = () => {

  const [labours, setLabours] = useState([]);
  const auth = useSelector((state) => state.auth);

  const fetchLabour = async () =>{
    try {
      const res = await axios.get(`${url}/api/v2/labour/get-labours`);


      setLabours(res.data.labours);
      
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const deleteLabour = async (id) => {
    try {
      const res = await axios.delete(`${url}/api/v2/labour/delete-labour/${id}`,{
        headers: {
          Authorization: auth.token
        } 
      });

      fetchLabour();
      
    } catch (error) {
      toast.error(res.data.message);
    }
  }

  useEffect(() => {
    fetchLabour()
  }, [])
  return (
    <>
        <Admin_Header/>

        <div className="container mt-5 p-5">
        <Link to = '/dashboard/admin/create-labour'>
        <button className="btn btn-primary">Add New</button>

        </Link>        
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th> Labour Service Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          labours.map((labour, index) => {  
            return (
              <tr key={labour._id}>
                <td>{index + 1}</td>
                <td>{labour.name}</td>
                <td>
                  <Link to={`/dashboard/admin/update-labour/${labour._id}`}>
                    <button className="btn btn-primary">Edit</button>
                  </Link>
                </td>
                <td>
                <button className="btn btn-danger" onClick={() => deleteLabour(labour._id)}>Delete</button>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
    </div>
    </>
  )
}

export default LabourList