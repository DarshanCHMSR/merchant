import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { url } from "./backend_link/data";
import axios from "axios";
import Loader_2 from "./Loading/Loader_2";
import Slider from "react-slick";

const Category = () => {
  const [Category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/v2/category/get-categories`);
      setCategory(res.data.data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader_2 />;
  }

  const getLink = (categoryName,id) => {
    if (categoryName === "Book Ride") {
      return "/book-ride";
    } else if (categoryName === "Schedule Event") {
      return "/event";
    } else if(categoryName === "Urban Services") {
      return "/urban-services";
    } else {
      return `/category-products/${id}`;
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="mt-5">
      <div className="container">
        <Slider {...settings}>
          {Category.map((category, index) => (
            <div className="category-item" key={index} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9", textAlign: "center" }}>
              <Link
                to={`${getLink(category.name,category._id)}`}
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ textDecoration: "none", color: "#333" }}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="category-icon-container mb-1">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="img-fluid"
                    loading="lazy"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div
                  className="text-dark mt-1 card-text"
                  style={{ fontSize: "0.8rem", fontWeight: "1px" }}
                >
                  {category.name}
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Category;
