//import React from 'react';
import logo from '../assets/NWU-Acronym-Logo-White-Digital.png';

const Navbar = () => {
  return (
    <nav className="bg-primary-dark text-white px-6 relative">
      <div className="container mx-auto flex justify-between items-center h-24">
        
        {/* LEFT: Logo */}
        <div className="flex items-center relative h-24">
          <img 
            src={logo} 
            alt="AACMS Logo" 
            className="h-[124px] w-auto absolute -top-7 left-0" 
          />
        </div>
        
        {/* RIGHT: Title */}
        <div className="flex items-center ml-32">
          <h1 className="text-2xl font-poppins font-semibold tracking-wide">
            AACMS
          </h1>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;  