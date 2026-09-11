//import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-9">
      
      {/* ===== TOP LEFT LOGO ===== */}
      <div className="w-full flex justify-start mb-6">
        <img 
          src="/NWU-Acronym-Logo-Purple-Digital.png" 
          alt="NWU Logo" 
          className="h-12 w-auto"
        />
      </div>

      {/* ===== CENTERED RECTANGLE ===== */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-7xl h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
          
          {/* ===== VIDEO SECTION - 70% ===== */}
          <div className="relative w-full h-[80%] bg-primary">
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
            </video>
            
            <div className="text-center max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-white drop-shadow-2xl leading-tight">
<<<<<<< HEAD
                Assistants Application &<br />
                <span className="text-white">Claims Management System</span>
              </h1>
              <p className="text-white/90 text-base md:text-lg mt-3 font-inter max-w-2xl mx-auto drop-shadow-lg">
                Streamline your assistants applications, track working hours, and manage claims all in one place.
=======
                Assistant Application &<br />
                <span className="text-white">Claims Management System</span>
              </h1>
              <p className="text-white/90 text-base md:text-lg mt-3 font-inter max-w-2xl mx-auto drop-shadow-lg">
                Streamline your Assistant applications, track working hours, and manage claims all in one place.
>>>>>>> 0221489 (Changed dacms to aacms and demi to assistant)
              </p>
            </div>

            {/* ===== THREE ROLE BUTTONS ===== */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 md:gap-6">
              
              <div className="text-center max-w-4xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-white drop-shadow-2xl leading-tight">
                  Assistant Applications &<br />
                  <span className="text-white">Claims Management System</span>
                </h1>
                <p className="text-white/90 text-sm md:text-base mt-2 font-inter max-w-2xl mx-auto drop-shadow-lg">
                  Streamline your Assistant applications, track working hours, and manage claims all in one place.
                </p>
              </div>

              {/* ===== THREE ROLE BUTTONS ===== */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
                
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="bg-white text-primary-dark px-8 py-3 rounded-xl font-semibold text-center hover:bg-primary-light hover:text-white transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] min-w-[140px] cursor-pointer"
                >
                  <span className="block text-base">Student</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('lecturer')}
                  className="bg-white text-primary-dark px-8 py-3 rounded-xl font-semibold text-center hover:bg-primary-light hover:text-white transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] min-w-[140px] cursor-pointer"
                >
                  <span className="block text-base">Lecturer</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('admin')}
                  className="bg-white text-primary-dark px-8 py-3 rounded-xl font-semibold text-center hover:bg-primary-light hover:text-white transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] min-w-[140px] cursor-pointer"
                >
                  <span className="block text-base">Administrator</span>
                </button>

              </div>

            </div>
          </div>

          {/* ===== WHITE SECTION - 30% ===== */}
          <div className="w-full h-[30%] bg-white" />

        </div>
      </div>

      <div className="mt-9 text-neutral/60 text-sm font-inter text-center">
        <p>© 2026 North-West University • AACMS</p>
      </div>

    </div>
  );
};

export default LandingPage;