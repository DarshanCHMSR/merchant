import React, { useEffect, useState } from 'react'
import Admin_Header from '../Components/Admin_Header'
import Backbutton from '../../../Components/Backbutton'
import { Link } from 'react-router-dom'
import { url } from '../../../Components/backend_link/data'
import toast from 'react-hot-toast'
import axios from 'axios'
import Loader from '../../../Components/Loading/Loader'
import { useSelector } from 'react-redux'

const EventList = () => {

    const [events, setEvents] = useState([])

    useEffect(() => {
        fetchEvents();
     
}, [])

const [loading, setLoading] = useState(false);
    const fetchEvents = async () => {   
        try {
            const res = await axios.get(`${url}/api/v2/event/get-events`)
            setEvents(res.data.events)   
           
        } catch (error) {
          console.log(error)
          toast.error(res.data.message)
        }
      }
    

      const auth = useSelector((state) => state.auth);
    const deleteEvent = async (id) => {
        setLoading(true)
        
        try {
          await axios.delete(`${url}/api/v2/event/delete-event/${id}`,{
            headers:{
              Authorization: auth?.token
            }
          })
          toast.success('Event deleted successfully')
          fetchEvents()
          setTimeout(() => {
            setLoading(false)            
          }, 1000);
        } catch (error) {
          toast.error(error.response.data.message)
        }
      }

      if(loading){
        return <Loader/>
      }

  return (
    <>
    <Admin_Header/>

    <div className="container mt-5">
      <Backbutton path = {'/dashboard/admin'}/>

          <h1 className="text-center mb-5">Event List</h1>
          <Link to= {'/dashboard/admin/create-event'}><button className="btn btn-primary mb-3">Add a Event</button></Link>
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
                  {events.map((item) => (
                    <tr key={item._id}>
                      
                      <td>{item._id}</td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>
                      <Link to={`/dashboard/admin/delete-product/${item._id}`}>
                          <button className="btn btn-danger" onClick={() => deleteEvent(item._id)}>Delete</button>
                      </Link>
                      </td>
                      <td>
                      <Link to={`/dashboard/admin/update-event/${item._id}`}>
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

export default EventList