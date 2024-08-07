import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import { useNavigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { QueryClientProvider } from "react-query";
import queryClient from "./queryClient";
import { refreshToken } from "./utils/auth";
import API_URL from "./config";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(`${API_URL}:refreshToken`);
      if (token) {
        try {
          await refreshToken();

          navigate("/dashboard/home");
          console.log(
            "Token refreshed successfully, setting isLoggedIn to true"
          );
        } catch (error) {
          console.error("Failed to refresh token:", error);
          setIsLoggedIn(false);
        }
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
