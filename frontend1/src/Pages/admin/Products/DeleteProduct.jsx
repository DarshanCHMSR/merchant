import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Admin_Header from '../Components/Admin_Header';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Backbutton from '../../../Components/Backbutton';
import { url } from '../../../Components/backend_link/data';

const DeleteProduct = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const deleteProduct = async () =>{

        setLoading(true);

        try {
            const res = axios.delete(`${url}/api/v2/products/delete-product/${id}`,{
                headers:{
                    Authorization: auth?.token
                }
            })
            

            setTimeout(() => {
                setLoading(false);
                toast.success("Product deleted successfully");
                navigate('/dashboard/admin/product-list');
            }, 1000);
            console.log(res);

        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
        <Admin_Header/>
      <Toaster/>

      <div className='container mt-5'>
      <Backbutton path = {'/dashboard/admin/product-list'}/>

      <h1 className='text-3xl font-bold mt-4 text-center text-gray-800 uppercase '>Delete Product</h1>
      <p className='text-2xl font-bold mb-4 text-center text-gray-800 uppercase '>Are you sure you want to delete this book?</p>
      <div className='d-flex justify-content-center'>
        <button onClick={deleteProduct} className='btn btn-danger'>{loading ? 'Please Wait...' : 'Yes'}</button>
      </div>
    </div>
    </>
  )
}

export default DeleteProduct