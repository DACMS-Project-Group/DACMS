//import React from 'react';
import logo from '../assets/NWU-Acronym-Logo-White-Digital.png';

const Navbar = () => {
  return (
    <nav className="w-full bg-primary-dark text-white px-6 py-4">
      <div className="w-full mx-auto flex justify-between items-center">
        
        {/* ===== LEFT SIDE: Logo ===== */}
        <div className="flex items-center gap-4">
          {/* 
            OPTION 1: If logo is in public folder 
            Change "logo.png" to your actual filename
          */}
          <img 
            src= {logo} 
            alt="DACMS Logo" 
            className="h-10 w-auto" 
          />
          
          {/* 
            OPTION 2: If logo is in src/assets 
            Uncomment below and comment out the img above 
          */}
          {/* 
          import logo from '../assets/logo.png';  // Add this at the top
          <img 
            src={logo} 
            alt="DACMS Logo" 
            className="h-10 w-auto" 
          />
          */}
        </div>
        
        {/* ===== RIGHT SIDE: Application Title ===== */}
        <div className="flex items-center">
          <h1 className="text-xl font-poppins font-semibold tracking-wide">
            Demi Application and Claims Management System
          </h1>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
/*
Code	                                What it means
const Navbar = () => { return (...)}	Creates a reusable navbar
className="bg-primary-dark"          	Makes the background dark purple
className="text-white"	                Makes text white
className="flex"	                    Makes items sit side-by-side
className="gap-8"	                    Adds spacing between items
className="hover:bg-primary-light"  	Changes color when you hover
*/