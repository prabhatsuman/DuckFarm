import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen }) {
    return (
        <div className={`flex flex-col h-screen w-1/6 bg-gradient-to-br from-blue-950 to-slate-950
         text-white p-12 sticky top-0 shadow-md transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full hidden'}  md:translate-x-0 `}>
            <div>
                <div className="pb-4">
                    <h2 className="text-2xl font-bold">Duck Farm</h2>
                </div>
                <nav className="mt-6">
                    <NavLink
                        to="/dashboard/home"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded hover:bg-cyan-800 ${isActive ? 'bg-cyan-800' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/dashboard/dealerinfo"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded hover:bg-cyan-800 ${isActive ? 'bg-cyan-800' : ''}`
                        }
                    >
                        Dealer Info
                    </NavLink>
                    <NavLink
                        to="/dashboard/stockinfo"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded hover:bg-cyan-800 ${isActive ? 'bg-cyan-800' : ''}`
                        }
                    >
                        Stock Info
                    </NavLink>
                    <NavLink
                        to="/dashboard/eggcollection"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded hover:bg-cyan-800 ${isActive ? 'bg-cyan-800' : ''}`
                        }
                    >
                        Egg Collection
                    </NavLink>
                    <NavLink
                        to="/dashboard/expenses"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded hover:bg-cyan-800 ${isActive ? 'bg-cyan-800' : ''}`
                        }
                    >
                        Expenses
                    </NavLink>
                    <NavLink
                        to="/dashboard/sales"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded hover:bg-cyan-800 ${isActive ? 'bg-cyan-800' : ''}`
                        }
                    >
                        Sales
                    </NavLink>
                </nav>
            </div>
        </div>
    );
}
