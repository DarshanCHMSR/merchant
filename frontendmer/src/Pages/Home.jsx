import React, { useEffect, useState } from "react";
import Category from "../Components/Category";
import Products from "../Components/Products";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { url } from "../Components/backend_link/data";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import toast from "react-hot-toast";

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [imgLink, setImgLink] = useState([]);
  const [recItems, setRecItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [dispatch]);

  const fetchData = async () => {
    try {
      const [recItemsRes, imgLinksRes] = await Promise.all([
        axios.get(`${url}/api/v2/products/section-two`),
        axios.get(`${url}/api/v2/section/section-link`),
      ]);

      setRecItems(recItemsRes.data);
      setImgLink(imgLinksRes.data.section);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pt-3">
        <div className="container">
          <div className="row gx-3 main-content">
            <main className="col-12">
              {loading ? (
                <Skeleton height={400} />
              ) : (
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={30}
                  slidesPerView={1}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  navigation
                  loop={true}
                >
                  {/* Map through imgLink to create slides */}
                  {imgLink.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="card-banner d-flex flex-column justify-content-center align-items-center text-center text-white"
                      >
                        <img src={`${item.image}`} alt="" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </main>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="container">
          <div className="row gx-3">
            <main className="col-lg-9">
              <Skeleton
                height={300}
                count={5}
                style={{ marginBottom: "20px" }}
              />
            </main>
            <aside className="col-lg-3">
              <Skeleton height={300} />
            </aside>
          </div>
        </div>
      ) : (
        <>
          <Category />
          <Products recItems={recItems} />
        </>
      )}
    </>
  );
};

export default Home;
