import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-9">
      
      {/* ===== TOP LEFT LOGO ===== */}
      <div className="w-full flex justify-start mb-9">
        <img 
          src="/NWU-Acronym-Logo-Purple-Digital.png" 
          alt="NWU Logo" 
          className="h-12 w-auto"
        />
      </div>

      {/* ===== WHITE BOX ===== */}
      <div className="relative w-full max-w-7xl rounded-2xl overflow-hidden shadow-2xl flex-1 mx-auto">
        
        {/* ===== VIDEO BACKGROUND ===== */}
        <div className="relative w-full h-full min-h-[550px] bg-primary">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
            poster="/NWU-Acronym-Logo-Purple-Digital.png"
          >
            <source src="/GradientVideo.mp4" type="video/mp4" />
            {/* Fallback: Video doesn't load, background shows primary color */}
          </video>
          
          {/* ===== OVERLAY CONTENT ===== */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-12">
            
            {/* ===== DACMS TITLE ===== */}
            <div className="text-center max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-white drop-shadow-2xl leading-tight">
                Demi Application &<br />
                <span className="text-white">Claims Management System</span>
              </h1>
              <p className="text-white/90 text-base md:text-lg mt-3 font-inter max-w-2xl mx-auto drop-shadow-lg">
                Streamline your Demi applications, track working hours, and manage claims all in one place.
              </p>
            </div>

            {/* ===== THREE BUTTONS ===== */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 md:gap-6">
              
              <a
                href="/student-dashboard"
                className="bg-white text-primary-dark px-10 py-4 rounded-xl font-semibold text-center hover:bg-primary-light hover:text-white transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] min-w-[160px]"
              >
                <span className="block text-lg">Student</span>
              </a>

              <a
                href="/lecturer-dashboard"
                className="bg-white text-primary-dark px-10 py-4 rounded-xl font-semibold text-center hover:bg-primary-light hover:text-white transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] min-w-[160px]"
              >
                <span className="block text-lg">Lecturer</span>
              </a>

              <a
                href="/admin-dashboard"
                className="bg-white text-primary-dark px-10 py-4 rounded-xl font-semibold text-center hover:bg-primary-light hover:text-white transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] min-w-[160px]"
              >
                <span className="block text-lg">Administrator</span>
              </a>

            </div>

          </div>
        </div>

      </div>

      {/* ===== FOOTER ===== */}
      <div className="mt-9 text-neutral/60 text-sm font-inter text-center">
        <p>© 2026 North-West University • DACMS</p>
      </div>

    </div>
  );
};

export default LandingPage;