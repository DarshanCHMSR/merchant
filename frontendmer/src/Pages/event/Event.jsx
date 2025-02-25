import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Components/Loading/Loader";
import Backbutton from "../../Components/Backbutton";
import EventProduct from "./EventProduct";
import axios from "axios";
import { url } from "../../Components/backend_link/data";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 

const Event = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const products = [
    {
      id: 1,
      name: "Balloon Decoration",
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/event/get-events`);
      setEvents(res.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div>
        <Backbutton path={"/"} />
        <Toaster />
        <div className="mb-4 slider-wrapper">
          <Slider {...sliderSettings} className="w-100">
            <div className="slider-content">
              <h3 className="text-center mb-4">Welcome to our Event Page</h3>
              <h4 className="text-center">Transforming Dreams into Reality</h4>
              <h5 className="text-center">
                Creating unforgettable moments with exceptional event planning and
                decoration services
              </h5>
            </div>
            <div className="slider-content">
              <h3 className="text-center mb-4">Your Event, Our Passion</h3>
              <h4 className="text-center">Let Us Make Your Vision Come True</h4>
              <h5 className="text-center">
                Experience the magic of perfectly planned events.
              </h5>
            </div>
            <div className="slider-content">
              <h3 className="text-center mb-4">Memorable Moments Await</h3>
              <h4 className="text-center">Crafting Unique Experiences</h4>
              <h5 className="text-center">
                From concept to execution, we handle it all.
              </h5>
            </div>
          </Slider>
        </div>

        <main>
          <h2 className="text-center text-gray-700 font-bold mb-4">Our services</h2>

          {/* Event Category Card */}
          <EventCard products={products} />

          <div>
            <h2 className="text-center text-gray-700 font-bold mb-4">
              Design solutions for your event
            </h2>
            <p className="text-center text-gray-700 mb-4">
              Take a look at some of the beautiful events we've created. From
              stunning flower arrangements to vibrant balloon decorations, our
              portfolio showcases our commitment to excellence and creativity.
            </p>
          </div>

          <div className="container mb-5">
            <div className="row justify-content-center">
              {loading ? (
                <Loader />
              ) : (
                events.map((item) => (
                  <EventProduct item={item} key={item._id} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Event;