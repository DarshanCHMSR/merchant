import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Components/Loading/Loader";
import Backbutton from "../../Components/Backbutton";
import EventProduct from "./EventProduct";
import axios from "axios";
import { url } from "../../Components/backend_link/data";


const Event = () => {

  const [loading, setloading] = useState(false);
  const [Book, setBook] = useState(false);

  const [events, setEvents] = useState([])

 

  // connt events useSelector((state.))

  const products = [
    {
      id: 1,
      name: "Ballon Decoration",
      description:
        "Elevate your event with stunning, custom balloon decorations that add a touch of magic",
      image:
        "https://media.istockphoto.com/id/1432655308/photo/birthday-decorations-balloons-garland-and-decor-for-little-baby-party-on-a-wall-background.webp?b=1&s=170667a&w=0&k=20&c=IP3ERbF4FSwLS3DyxaFW7A1AsbDWUmJZ_-2AVpepG4Q=",
    },

    {
      id: 2,
      name: "Flower Decoration",
      description:
        "Enchant your event with breathtaking flower decorations tailored to perfection!",
      image:
        "https://media.istockphoto.com/id/1178984568/photo/indian-couple-making-flower-rangoli-on-diwali-or-onam-festival-taking-selfie-or-holding-sweets.webp?b=1&s=170667a&w=0&k=20&c=-vaBOVaRnjUzS_LF6kY01yYBH7fycZ2kxBpwX0vt4a8=",
    },
    // Add more products as needed
  ];

 

  useEffect(() => {
    fetchEvents()
  }, [])
  

  const fetchEvents = async() =>{

    try {
      const res = await axios.get(`${url}/api/v2/event/get-events`);
      setEvents(res.data.events);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <div>
        <Backbutton path={"/"} />
        <Toaster />
        <header
          className="text-center text-gray-700 font-bold font-weight-bold text-5xl mb-4"
          style={{
            marginTop: "2vh",
            marginBottom: "2vh",
            width: "100%",
            height: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "50px",
            fontWeight: "bold",
            color: "white",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            overflow: "hidden",
          }}
        >
          <h3 className="text-center text-gray-700 font-bold font-weight-bold mb-4">
            {" "}
            Welcome to our Event Page
          </h3>
          <h4 className="text-center">Transforming Dreams into Reality</h4>
          <h5 className="text-center">
            Creating unforgettable moments with exceptional event planning and
            decoration services
          </h5>
        </header>

        <main>
          <h2 className=" text-center text-gray-700 font-bold font-weight-bold mb-4">
            Our services
          </h2>


            {/* Event Category Card */}
          <EventCard products={products} />

          <div>
            <h2 className="text-center text-gray-700 font-bold font-weight-bold mb-4">
              Design solutions for your event
            </h2>
            <p className="text-center text-gray-700 font-weight-bold mb-4">
              Take a look at some of the beautiful events we've created. From
              stunning flower arrangements to vibrant balloon decorations, our
              portfolio showcases our commitment to excellence and creativity
            </p>
          </div>

          <div className="container mb-5">
            <div className="row justify-content-center">
             {
              events.map((item) =>{
                return <EventProduct item = {item} key = {item._id}/>
              })
             }
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Event;
