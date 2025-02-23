import React, { useEffect, useState } from 'react'
import Admin_Header from '../Components/Admin_Header'
import axios from 'axios'
import { url } from '../../../Components/backend_link/data'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'


const LinkTable = () => {

    const [imgLink, setImgLink] = useState([]);

    const auth  = useSelector((state) => state.auth);

    useEffect(() => {
        fetchinks();
    },[])


    const deleteLink = async (id) => {
        try {   
            const res = await axios.delete(`${url}/api/v2/section/delete-link/${id}`,{
                headers: {
                    Authorization: auth.token
                }
            })

            fetchinks();

        } catch (error) {  
          toast.error("Please try again later:", error); 
        }
      }


    const fetchinks = async () => {
        try {
            const res = await axios.get(`${url}/api/v2/section/section-link`)

            setImgLink(res.data.section);

        } catch (error) {
          toast.error("Please try again later:", error); 

        }
      }

  return (
    <>
    <Admin_Header/>

    <div className="container mt-5 p-5">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Image Link</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {imgLink.map((link, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              {
                link.image.map((img, index) => (
                  <img key={index} src={img} alt="image" width="100" height="100"  className='m-2'/>
                )
                )
              }
            </td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => deleteLink(link._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  )
}

export default LinkTable