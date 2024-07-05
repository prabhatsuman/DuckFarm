import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Typewriter from "../components/Typewriter";

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleComponent = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen flex flex-col bg-main">
      {/* Navigation Bar */}
      <nav className="py-6 px-6">
        <h1 className="text-6xl font-serif font-bold text-left text-black">
          Duck Farm
        </h1>
      </nav>
      <div className="flex ">
        <div className="flex flex-col justify-start w-2/5">
          {/* Typewriter Effect */}
          <div className="text-white font-serif font-semibold text-3xl p-6 h-60">
            <Typewriter text="Welcome to Duck Farm - A comprehensive management system for your duck farm. Easily track and manage egg collection data, sales data, and expenses. Utilize powerful tools such as graphs, chatbots, and advanced filtration." />
          </div>

         
        </div>

        {/* Conditionally Render Login or Signup */}
        <div className="flex justify-end p-12 w-3/5">
          {showLogin ? (
            <Login toggleComponent={toggleComponent} />
          ) : (
            <Signup toggleComponent={toggleComponent} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
