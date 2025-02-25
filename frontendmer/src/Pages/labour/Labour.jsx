import React, { useEffect, useState } from "react";
import Backbutton from "../../Components/Backbutton";
import Labour_Card from "./Labour_Card";
import { url } from "../../Components/backend_link/data";
import axios from "axios";

const Labour = () => {
 
  const [labours, setLabours] = useState([])
  const fetchLabour = async () =>{
    try {
      const res = await axios.get(`${url}/api/v2/labour/get-labours`);


      setLabours(res.data.labours);
      
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    fetchLabour();
  }, [])

  return (
    <>
      <Backbutton path = "/"/>
      <section className="bg-light text-center py-5 mt-3">
        <div className="container">
          <h1 className="display-4">Find local services easily</h1>
          <p className="lead">
            Connecting you with skilled local professionals for all your needs.
          </p>
         
        </div>
      </section>

      <section id="how-it-works" className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">How it works</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-primary">Step 1</h5>
                  <p className="card-text">Select the service you need.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-primary">Step 2</h5>
                  <p className="card-text">
                    Enter your location. and select your preferred time.
                  </p>
                </div>
              </div>
            </div>
            {/* Add more steps as needed */}

            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-primary">Step 3</h5>
                  <p className="card-text">Get your service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mb-5">
        <h1 className="text-center mb-4">Book your service</h1>
            <div className="row justify-content-center">
              {labours.map((labour) => (
                <Labour_Card key={labour._id} item={labour} />
              ))}
            </div>
          </div>
    </>
  );
};

export default Labour;
