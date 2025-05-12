
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to navigate without using Link component
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-white border-t py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <button onClick={() => handleNavigation("/")} className="text-lg font-bold text-primary">
              EASY AI Quiz
            </button>
            <p className="mt-2 text-sm text-gray-500">
              AI-powered quiz generation and certification platform
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <button onClick={() => handleNavigation("/")} className="text-gray-500 hover:text-primary">
              Home
            </button>
            <button onClick={() => handleNavigation("/login")} className="text-gray-500 hover:text-primary">
              Log In
            </button>
            <button onClick={() => handleNavigation("/register")} className="text-gray-500 hover:text-primary">
              Register
            </button>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>&copy; {currentYear} EASY AI Quiz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
