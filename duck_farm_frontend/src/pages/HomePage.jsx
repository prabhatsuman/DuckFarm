import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const toggleLoginModal = () => {
    setShowLogin(!showLogin);
  };

  const toggleSignupModal = () => {
    setShowSignup(!showSignup);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">Duck Farm</h1>
          </div>
          <nav className="space-x-4">
            {/* Open Login Modal */}
            <button
              onClick={toggleLoginModal}
              className="text-gray-800 hover:text-gray-600 font-medium transition duration-300"
            >
              Login
            </button>
            {/* Open Signup Modal */}
            <button
              onClick={toggleSignupModal}
              className="text-gray-800 hover:text-gray-600 font-medium transition duration-300"
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content - Image Carousel */}
      <main className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Replace this with your carousel component or image grid */}
        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Image Carousel
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Coming Soon
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Your carousel or image grid will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <Login handleClose={toggleLoginModal} />
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <Signup handleClose={toggleSignupModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
