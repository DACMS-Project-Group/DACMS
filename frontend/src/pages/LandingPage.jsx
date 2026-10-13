import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  document.title = 'AACMS - Landing Page';

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/login?view=register');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-6 md:py-9">
      {/* Top-left logo */}
      <div className="w-full flex justify-start mb-4 md:mb-6">
        <img
          src="/NWU-Acronym-Logo-Purple-Digital.png"
          alt="NWU Logo"
          className="h-10 md:h-12 w-auto"
        />
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-7xl rounded-2xl overflow-hidden shadow-2xl min-h-[520px] md:min-h-[600px] md:h-[75vh]">
          {/* Video / hero panel */}
          <div className="relative w-full h-full bg-primary">
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

            {/* Overlay content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-8">
              <div className="text-center max-w-4xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-white drop-shadow-2xl leading-tight">
                  Assistant Applications &<br />
                  <span className="text-white">
                    Claims Management System
                  </span>
                </h1>

                <p className="text-white/90 text-sm md:text-base mt-3 font-inter max-w-2xl mx-auto drop-shadow-lg">
                  Streamline your Assistant applications, track working hours,
                  and manage claims all in one place.
                </p>
              </div>

              <div className="mt-6 md:mt-8">
                <button style={{ marginRight: "20px" }}
                  onClick={handleLogin}
                  className="bg-white text-primary-dark px-10 md:px-12 py-3 md:py-4 rounded-xl font-semibold text-center hover:bg-primary-light hover:text-white transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] min-w-[180px] md:min-w-[200px] cursor-pointer"
                >
                  <span className="block text-base md:text-lg">Login</span>
                </button>
                <button style={{ marginLeft: "20px" }}
                  onClick={handleRegister}
                  className="bg-white text-primary-dark px-10 md:px-12 py-3 md:py-4 rounded-xl font-semibold text-center hover:bg-primary-light hover:text-white transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] min-w-[180px] md:min-w-[200px] cursor-pointer"
                >
                  <span className="block text-base md:text-lg">Register</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-neutral/60 text-xs md:text-sm font-inter text-center mt-4 md:mt-6">
        <p>© 2026 North-West University • AACMS</p>
      </div>
    </div >
  );
};

export default LandingPage;