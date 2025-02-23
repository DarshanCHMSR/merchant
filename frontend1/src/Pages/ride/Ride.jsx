import React,{ useEffect, useState,} from 'react'
import Card from './Card'
import { useSelector } from "react-redux";
import { IoCall } from "react-icons/io5";
import Loader_2 from '../../Components/Loading/Loader_2';
import toast from 'react-hot-toast';
import axios from 'axios';
import { url } from '../../Components/backend_link/data';


export const Ride = () => {
  const auth = useSelector((state) => state.auth);
  const [check, setcheck] = useState(false);

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false)

  const [vehicle, setVehicle] = useState([]);

  useEffect(() => {
    if (auth?.user) {
      setcheck(true);
    } else {
      setcheck(false);
    }

    fetchVehciles();
  }, []);


  const fetchVehciles = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/vehicle/get-vehicles`);
      setVehicle(res.data.vechicle);
      
    } catch (error) {
      toast.error("Internal sever error");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here

    try {
      setLoading(true);
      const res = await axios.post(`${url}/api/v2/mail/enquiry-mail`, {
        name: username,
        phone: phone,
      });

      if(res.data.success){
        setLoading(false);
        toast.success("Enquiry sent successfully");
        setcheck(true);
      }
      
    } catch (error) {
      toast.error("Please try again later")
      setLoading(false);
    }

  };


  return (
    <>
     <main className=" container mt-5">
        <div className="header clearfix"></div>
        <div className="row ">
          <div className="col-lg-12">
            <h2 className="text-center text-primary fw-bold">
              Book Your Ride today
            </h2>
            <p className="text-center">
              Book your ride today and experience seamless travel
            </p>

            {/* <a class="btn btn-success" href="#" role="button">Gviy Ychlo</a> */}
          </div>
        </div>
        <h3 className="fw-bold">Vehicle Details and Price</h3>

        {
          vehicle.map((item) => (
            <Card item = {item} key = {item._id} />
          ))
        }


        {check ? (
            <div className="button d-flex justify-content-center mb-5">
              <button
                className="btn btn-primary"
                role="button"
                onClick={() => (window.location.href = `tel:+91 9900718715`)}
              >
                <IoCall className="fs-10" /> Get in touch...
              </button>
            </div>
          ) : (
            <>
              {
                loading ? (
                  <Loader_2 className="text-center" style = {{margin:"auto"}} />
                ) :(
                  <>
                  <h6>Please the fill the below form info to get connect</h6>
              <div className="container my-5">
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          Name 
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
                  </>
                )
              }
            </>
          )}

        </main>

    </>
  )
}
