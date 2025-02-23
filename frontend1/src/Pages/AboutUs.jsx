import React from 'react';

const AboutUs = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4"> About Us</h2>
      <div className='d-flex justify-content-center'>
      <img  className='img-fluid w-25 h-fill' src="https://valuekartslogo.s3.ap-south-1.amazonaws.com/LOGO.webp" alt="" />

      </div>

      <p className="text-muted">
        <strong className='text-primary'>VALUEKARTS</strong> is an innovative startup founded in 2024 with the mission to provide quality products and services at wholesale prices. Our platform is dedicated to offering a wide range of items, including CCTV equipment, at competitive prices. But that's not all—Monoking.in is more than just an e-commerce website.
      </p>
      <p className="text-muted">
        We also offer a comprehensive decoration booking system, an urban labor booking system, and a vehicle booking system, making us a one-stop solution for a variety of your needs. Whether you're looking to secure your home with high-quality CCTV, book decoration services for your events, find skilled labor for urban tasks, or arrange for transportation, Monoking.in has you covered.
      </p>
      <p className="text-muted">
        As a growing startup, we are committed to expanding our offerings and improving our services to meet the diverse needs of our customers. Join us on our journey as we work towards making Monoking.in your go-to platform for quality products and reliable services.
      </p>
    </div>
  );
};

export default AboutUs;
