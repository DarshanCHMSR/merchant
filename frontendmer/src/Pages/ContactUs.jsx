import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { url } from "../Components/backend_link/data";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handaleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/v2/mail/support-mail`, {
        name: e.target.name.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        subject: e.target.subject.value,
        message: e.target.message.value,
      });
      toast.success("Enquiry sent successfully");
      setSent(true);
      setLoading(false);
    } catch (error) {
      toast.error("Please try again later");
      setLoading(false);
    }
  };
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Contact Us</h2>

      <div className="row">
        <div className="col-md-6">
          <h5>Get in Touch</h5>
          <p>
            If you have any questions, feel free to reach out to us. We are here
            to help!
          </p>

          <form onSubmit={handaleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="phone"
                className="form-control"
                id="phone"
                placeholder="Your Phone"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="subject"
                placeholder="Subject"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="4"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {sent ? (
            <p className="text-success mt-3">
              Enquiry sent successfully We'll get back to soon
            </p>
          ) : null}
        </div>

        <div className="col-md-6">
          <h5>Contact Information</h5>
          <ul className="list-unstyled">
            <li>
              <strong>Address:</strong>
              <p>Bangalore, Karnataka 560091, India</p>
            </li>
            <li>
              <strong>Email:</strong>
              <p>support.valuekarts.com@gmail.com</p>
            </li>
          </ul>

          <div className="mt-4">
            <h6>Follow Us</h6>
            <a
              href="https://www.facebook.com/share/hqa3ehQRTEPVSBFD/?mibextid=qi2Omg"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary m-1"
            >
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a
              href="https://www.instagram.com/valuekartsdotcom?utm_source=qr&igsh=Mm1wdng0ZW1kMTJi"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-danger m-1"
            >
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
