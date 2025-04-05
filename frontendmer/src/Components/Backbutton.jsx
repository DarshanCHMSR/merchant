import React from 'react'
import { Link } from 'react-router-dom'
import { IoMdArrowBack } from "react-icons/io";

const Backbutton = ({path}) => {
  return (
    <div>
      <Link to = {`${path}`} className="btn btn-outline-primary m-3 mb-0" href="#"> <IoMdArrowBack className='mb-1' />
      Back</Link>
    </div>
  )
}

export default Backbutton