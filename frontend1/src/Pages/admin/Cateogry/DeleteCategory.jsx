import React, { useState } from 'react'
import Admin_Header from '../Components/Admin_Header'
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Backbutton from '../../../Components/Backbutton';
import { url } from '../../../Components/backend_link/data';



const DeleteCategory = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const auth = useSelector((state) => state.auth);
  
    const navigate =   useNavigate();
  const deleteCategory = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${url}/api/v2/category/delete-category/${id}`,{
        headers: {
          Authorization: auth?.token,
        },
      });


      setTimeout(() => {
        setLoading(false);
        toast.success("Category deleted successfully");
        navigate('/dashboard/admin/category-list');
      }, 1000);
      console.log(res);
    } catch (error) {
      setLoading(false);
      toast.error('An error occurred please try again later');
      console.log(error);
    }
  };

  return (
    <>
      <Admin_Header/>
      <Toaster/>
      <div className='container mt-5'>
      <Backbutton path = {'/dashboard/admin/category-list'}/>


      <h1 className='text-3xl font-bold mt-4 text-center text-gray-800 uppercase '>Delete Category</h1>
      <p className='text-2xl font-bold mb-4 text-center text-gray-800 uppercase '>Are you sure you want to delete this book?</p>
      <div className='d-flex justify-content-center'>
        <button onClick={deleteCategory} className='btn btn-danger'>{loading ? 'Please Wait...' : 'Yes'}</button>
      </div>
    </div>
    </>
  )
}

export default DeleteCategory