// Layout.js
import React from 'react';
import Header from './Header'; // Adjust the import based on your file structure
import Footer from './Footer'; // Adjust the import based on your file structure

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
