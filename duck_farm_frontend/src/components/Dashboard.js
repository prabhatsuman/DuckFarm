import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DealerInfo from './DealerInfo';
import Home from './Home';
import StockTable from './StockTable';
import EggCollectionCalander from './EggCollectionCalander';
import ExpenseTable from './ExpenseTable';
import SalesTable from './SalesTable';

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
                <main className="flex-auto px-6 py-3 h-full">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="dealerinfo" element={<DealerInfo />} />
                        <Route path="stockinfo" element={<StockTable />} />
                        <Route path="eggcollection" element={<EggCollectionCalander />} />
                        <Route path="expenses" element={<ExpenseTable />} />
                        <Route path="sales" element={<SalesTable />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
