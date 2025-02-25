import React, { useEffect, useState,  } from "react";


const Card = ({item }) => {


  return (
    <>
     <div className="row">
        <div
          className="col-lg-4 w-100"
          style={{
            backgroundColor: "#f8f9fa",
            margin: "10px",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <h4 className="text-center fw-bold">{item.name}</h4>
          <p>* Per KM {item.kmPrice}.Rs</p>
          <p>* Per day Min KM {item.minKm}</p>
          <p>* Per day driver bata {item.bata}.Rs</p>
          <p>* Some Additional Charges</p>

          <p>
            (Toll Charge) (Parking Charge) (Working hours are from 6:00 AM :
            10:00 PM. Upon exceeding working hours, there is an extra charge.)
          </p>

          <h4>Additional info</h4>

          <p>{item.description}</p>

          <div className="row">
            {item?.image.map((link, index) => (
              <div key={index} className="col-6 mb-3 d-flex justify-content-center">
                <img
                  src={link}
                  alt={`Image ${index + 1}`}
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
