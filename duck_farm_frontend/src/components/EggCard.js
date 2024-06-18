import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi'; // Import icons from react-icons library
import AddEggForm from './AddEggForm'; // Import the AddEggForm component

const EggCard = ({ logoUrl }) => {
    const [totalEggs, setTotalEggs] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [showAddEggForm, setShowAddEggForm] = useState(false);

    useEffect(() => {
        fetchTotalEggs();
    }, []);

    const fetchTotalEggs = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/egg_stock/total_stock/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTotalEggs(data.total_stock);
            } else {
                console.error('Failed to fetch total eggs');
            }
        } catch (error) {
            console.error('Error fetching total eggs:', error);
        }
    };

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const handleButtonMouseEnter = (buttonType) => {
        setHoveredButton(buttonType);
    };

    const handleButtonMouseLeave = () => {
        setHoveredButton(null);
    };

    const handleAddEggs = () => {
        setShowAddEggForm(true);
    };

    const handleEggAdded = () => {
        setShowAddEggForm(false);
        fetchTotalEggs(); // Refresh the total eggs count
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg relative">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={logoUrl} alt="Egg Logo" className="object-cover h-16 w-16 mr-3" />
                    </div>
                    <div
                        className="flex flex-col items-end relative justify-center"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {!hovered ? (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 text-wrap">Egg Stock</h3>
                                <p className="mt-2 text-sm text-gray-500 text-right">{totalEggs} eggs</p>
                            </div>
                        ) : (
                            <div className="flex items-center mt-4">
                                <button
                                    className="relative flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 mr-2"
                                    onClick={handleAddEggs}
                                    onMouseEnter={() => handleButtonMouseEnter('add')}
                                    onMouseLeave={handleButtonMouseLeave}
                                >
                                    <FiPlus className="text-lg" />
                                    {hoveredButton === 'add' && (
                                        <span className="absolute bottom-8 text-xs bg-yellow-200 text-black py-1 px-3 rounded-lg shadow-lg">
                                            Add Egg Collection
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showAddEggForm && (
                <AddEggForm
                    onClose={() => setShowAddEggForm(false)}
                    onEggAdded={handleEggAdded}
                />
            )}
        </div>
    );
};

export default EggCard;
