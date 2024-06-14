import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DealerInfo from './DealerInfo';
import Home from './Home';

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex justify-center align-top"> 
                <Sidebar isOpen={isSidebarOpen} />
            <div className="flex flex-auto flex-col"> 
            <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-auto p-6 h-full">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="dealerinfo" element={<DealerInfo />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
