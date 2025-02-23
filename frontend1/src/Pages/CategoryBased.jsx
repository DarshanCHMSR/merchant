import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { url } from "../Components/backend_link/data";
import SingleProduct from "../Components/SingleProduct";
import Loader_2 from "../Components/Loading/Loader_2";
import Loader from "../Components/Loading/Loader";
import Backbutton from "../Components/Backbutton";



const CategoryBased = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const [products, setProducts] = useState([]);

  const [Loading, setLoading] = useState(false)


  useEffect(() => {
    setLoading(true)
    fetchCategoryBasedProducts();
  },[id])


  const fetchCategoryBasedProducts  = async() =>{
    try {
        const res = await axios.get(`${url}/api/v2/products/get-product-by-category/${id}`);
        setProducts(res.data);

        console.log(res.data)
        
        setLoading(false)

    } catch (error) {
        console.log(error)
        toast.error(res.data.message);
        setLoading(false)
    }
  }


  if(Loading){
    return <Loader/>
  }

  return <>
      
      <section>
        <Backbutton path= "/" />
        <div className="container my-5">
          <header className="mb-4">
            <h3></h3>
          </header>

          <div className="row rec-products">
            {products.map((item) => {
              return <SingleProduct item={item} key={item._id} />;
            })}
          </div>
        </div>
      </section>
  </>;
};

export default CategoryBased;
