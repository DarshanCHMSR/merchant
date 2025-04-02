import React from 'react'
import { Link } from 'react-router-dom';


 const Feature = () => {
  return (
  <>
    <section>
    <div className="container ">
      <div className="card p-4 bg-primary">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="mb-0 text-white">Best products and brands in store</h4>
            <p className="mb-0 text-white-50">Trendy products and text to build on the card title</p>
          </div>
          <div className="col-auto "><Link to = {'/ProductView'} className="btn btn-white text-primary bg-white shadow-0" href="#">Discover</Link></div>
        </div>
        
      </div>
    </div>
  </section>
  </>
  )
}

export default Feature;