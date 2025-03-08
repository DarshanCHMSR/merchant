import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <div>
        <footer className="bg-dark text-light py-3 footer" >
            <p className="text-center">ValueCart &copy; {new Date().getFullYear()}</p>
            <a href='/'>Contact Us</a>
        </footer>
       
    </div>
  )
}

export default Footer 