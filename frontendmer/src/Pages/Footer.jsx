import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <div>
        <footer className="bg-dark text-light py-3 footer" >
            <p className="text-center">ValueCart &copy; {new Date().getFullYear()}</p>
            <a href='/register-form'>Contact Us</a>
            {/* <a href='/contact-us'>Products</a> */}
        </footer>
       
    </div>
  )
}

export default Footer 