import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ products }) => {
  return (
    <div>
      <div className="container mb-5">
        <div className="row justify-content-center">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100">
                <Link to={`event-details/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top img-fluid"
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
