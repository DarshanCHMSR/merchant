export const url  = 'https://monoking.onrender.com'



import React, { useEffect, useState } from "react";
import Category from "../Components/Category";
import Products from "../Components/Products";
import { Link } from "react-router-dom";
import { clearBuy } from "../State/cart_actions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../Components/backend_link/data";
import Loader_2 from "../Components/Loading/Loader_2";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [imgLink, setImgLink] = useState([]);
  const [recItems, setRecItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(clearBuy());
    fetchRecItems();
    fetchImgLinks();
  }, []);

  const fetchRecItems = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/products/section-two`);
      setRecItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImgLinks = async () => {
    try {
      const res = await axios.get(`${url}/api/v2/section/section-link`);
      setImgLink(res.data.section);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {loading && (
        <Loader_2 className="text-center" style={{
          height: "100vh",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
        }}/>
      )}

<section className="pt-3">
        <div className="container">
          <div className="row gx-3 main-content">
            <main className="col-lg-9">
              <div
                className="card-banner p-5 bg-warning rounded-5"
                style={{
                  backgroundImage: `url(${imgLink[0]?.image[0]})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="c-1">
                  <h2 className="text-white">
                    Great products with <br />
                    best deals
                  </h2>
                  <p className="text-white">
                    No matter how far along you are in your sophistication as an
                    amateur astronomer, there is always one.
                  </p>

                    <Link
                      to={"/ProductView"}
                      className="btn btn-light shadow-0 text-primary text-center"
                    >
                      {" "}
                      View more{" "}
                    </Link>
                </div>
              </div>
            </main>

            <aside className="col-lg-3">
              <div className="card-banner h-100 rounded-5 c-2">
                <div
                  className="card-body text-center pb-5 service-image service-res"
                  style={{
                    backgroundImage: `url(${imgLink[0]?.image[1]})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div>
                    <h5 className="pt-5 text-white">
                      Urban solutions simplified
                    </h5>
                    <p className="text-white">
                      Your urban lifestyle, our tailored solutions
                    </p>
                    <Link
                      to={`/urban-services`}
                      href="service.html"
                      className="btn btn-outline-light bg-light text-primary"
                    >
                      {" "}
                      View more{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Category />

      {loading ? <Loader_2 /> : <Products recItems={recItems} />}

      {!loading && (
        <>
          <Category />
          <Products recItems={recItems} />
        </>
      )}
    </>
  );
};

export default Home;

