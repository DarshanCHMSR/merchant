import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="text-center text-lg-start bg-light text-muted">
  {/* Subscription Section */}
  <section className="p-3 bg-light">
    <div className="container">
      <div className="row align-items-center">
        {/* Email Subscription */}
        <div className="col-md-6 mb-2 mb-md-0">
          <div className="input-group mx-auto" style={{ maxWidth: "400px" }}>
            <input
              type="email"
              className="form-control border"
              placeholder="Email"
              aria-label="Email"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-light border"
              type="button"
              id="button-addon2"
              data-mdb-ripple-color="dark"
            >
              Subscribe
            </button>
          </div>
        </div>
        {/* Social Media Links */}
        <div className="col-md-6 text-center text-md-end">
          <div className="bg-light p-2 rounded" style={{ display: "inline-block" }}>
            <a
              href="https://www.facebook.com/share/hqa3ehQRTEPVSBFD/?mibextid=qi2Omg"
              className="btn btn-icon px-2 m-1"
              title="Facebook"
              target="_blank"
            >
              <i className="fab fa-facebook-f fa-lg" style={{ fontSize: "25px", color: "#3b5998" }}></i>
            </a>
            <a
              href="https://www.instagram.com/valuekartsdotcom?utm_source=qr&igsh=Mm1wdng0ZW1kMTJi"
              className="btn btn-icon px-2 m-1"
              title="Instagram"
              target="_blank"
            >
              <i className="fab fa-instagram fa-lg" style={{ fontSize: "25px", color: "#E4405F" }}></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Main Footer Section */}
  <div className="container text-center text-md-start mt-4">
    <div className="row">
      {/* Logo and Copyright */}
      <div className="col-lg-3 mb-3">
        <img
          src="https://valuekartslogo.s3.ap-south-1.amazonaws.com/LOGO.webp"
          style={{
            width: "50%",
            objectFit: "cover",
            objectPosition: "center",
            margin: "auto",
            mixBlendMode: "multiply",
          }}
          alt="Logo 2"
          className="img-fluid"
        />
        <p className="mt-2">
          <strong>© {new Date().getFullYear()} valuekarts.com</strong>
        </p>
      </div>

      {/* Store Links */}
      <div className="col-6 col-sm-4 col-lg-2">
        <h6 className="text-uppercase text-dark fw-bold mb-3">Store</h6>
        <ul className="list-unstyled">
          <li>
            <Link to="/about-us" className="text-muted">
              About us
            </Link>
          </li>
          <li>
            <Link to="#" className="text-muted">
              Find store
            </Link>
          </li>
          <li>
            <Link to="/contact-us" className="text-muted">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Support Links */}
      <div className="col-6 col-sm-4 col-lg-2">
        <h6 className="text-uppercase text-dark fw-bold mb-3">Support</h6>
        <ul className="list-unstyled">
          <li>
            <Link to="/contact-us" className="text-muted">
              Help center
            </Link>
          </li>
          <li>
            <Link to="/dev" className="text-muted">
              Documents
            </Link>
          </li>
          <li>
            <Link to="/dev" className="text-muted">
              Account restore
            </Link>
          </li>
          <li>
            <Link to="/order-tracking" className="text-muted">
              My orders
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>

    </>
  );
};

export default Footer;
