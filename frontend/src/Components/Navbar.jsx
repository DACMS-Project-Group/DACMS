import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="container mx-auto flex items-center justify-between">

        {/* Logo / System Name */}
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-[#6C3D91]">
            DACMS
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">

          <a
            href="#"
            className="text-[#181512] font-medium hover:text-[#6C3D91] transition"
          >
            Dashboard
          </a>

          <a
            href="#"
            className="text-[#181512] font-medium hover:text-[#6C3D91] transition"
          >
            Applications
          </a>

          <a
            href="#"
            className="text-[#181512] font-medium hover:text-[#6C3D91] transition"
          >
            Claims
          </a>

          <a
            href="#"
            className="text-[#181512] font-medium hover:text-[#6C3D91] transition"
          >
            Profile
          </a>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;