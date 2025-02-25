import React from 'react'

const Service_Card = ({imgLink,title,description}) => {
  return (
    <>
    <div className="col-md-6 col-lg-4 mb-4 d-flex align-items-center">
            <img src = {`${imgLink}`} alt="Painting Service" className="img-fluid" style={{ width: '10vh', height: 'auto',
              borderRadius: '40%',
              objectFit: 'cover',
              objectPosition: 'center',
              margin: '0 0.9vw',
             }} />
            <div className="ml-3">
              <h5 className="mb-1">{title}</h5>
              <p className="mb-0 text-muted">{description}</p>
            </div>
          </div>
          </>
  )
}

export default Service_Card