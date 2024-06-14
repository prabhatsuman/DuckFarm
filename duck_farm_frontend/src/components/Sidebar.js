import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen }) {
    return (
        <div className={`flex flex-col h-screen w-64 bg-white text-black p-12 sticky top-0 rounded-xl border shadow-md transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full hidden'}  md:translate-x-0 rounded-r-lg`}>
            <div>
                <div className="pb-4">
                    <h2 className="text-2xl font-bold">Dashboard</h2>
                </div>
                <nav className="mt-6">
                    <Link to="/dashboard" className="block py-2.5 px-4 rounded hover:bg-gray-100">Home</Link>
                    <Link to="/dashboard/dealerinfo" className="block py-2.5 px-4 rounded hover:bg-gray-100">Dealer Info</Link>
                    <Link to="/dashboard/stockinfo" className="block py-2.5 px-4 rounded hover:bg-gray-100">Stock Info</Link>
                </nav>
            </div>
        </div>
    );
}
