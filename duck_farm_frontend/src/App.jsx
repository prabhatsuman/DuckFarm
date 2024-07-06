import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute";

import { QueryClientProvider } from "react-query";
import queryClient from "./queryClient";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/dashboard/*" element={<DashboardPage />} />
           
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
