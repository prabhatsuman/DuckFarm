import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from './pages/Dashboard';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';
import Test from './pages/Test';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/dashboard/*" element={<DashboardPage/>} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
