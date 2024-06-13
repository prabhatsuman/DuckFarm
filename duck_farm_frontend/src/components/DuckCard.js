import React, { useState, useEffect } from 'react';
import { FiInfo, FiPlus, FiMinus } from 'react-icons/fi'; // Import icons from react-icons library

const DuckCard = ({ logoUrl }) => {
    const [totalDucks, setTotalDucks] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [duckInfo, setDuckInfo] = useState(null);

    useEffect(() => {
        fetchTotalDucks();
    }, []);

    const fetchTotalDucks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/ducks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTotalDucks(data.total);
            } else {
                console.error('Failed to fetch total ducks');
            }
        } catch (error) {
            console.error('Error fetching total ducks:', error);
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

    const handleViewAdditionalInfo = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/ducks/info', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDuckInfo(data);
            } else {
                console.error('Failed to fetch duck info');
            }
        } catch (error) {
            console.error('Error fetching duck info:', error);
        }
    };

    const handleAddDucks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/ducks/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: 1 })
            });

            if (response.ok) {
                fetchTotalDucks(); // Refresh the total ducks count
            } else {
                console.error('Failed to add ducks');
            }
        } catch (error) {
            console.error('Error adding ducks:', error);
        }
    };

    const handleRemoveDucks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/ducks/remove', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: 1 })
            });

            if (response.ok) {
                fetchTotalDucks(); // Refresh the total ducks count
            } else {
                console.error('Failed to remove ducks');
            }
        } catch (error) {
            console.error('Error removing ducks:', error);
        }
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg relative">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={logoUrl} alt="Duck Logo" className="object-cover h-16 w-16 mr-3" />
                    </div>
                    <div
                        className="flex flex-col items-end relative justify-center"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {!hovered ? (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Ducks</h3>
                                <p className="mt-2 text-sm text-gray-500">{totalDucks} ducks</p>
                            </div>
                        ) : (
                            <div className="flex items-center mt-4">
                            <button
                                className="relative flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 mr-2"
                                onClick={handleViewAdditionalInfo}
                                onMouseEnter={() => handleButtonMouseEnter('info')}
                                onMouseLeave={handleButtonMouseLeave}
                            >
                                <FiInfo className="text-lg" />
                                {hoveredButton === 'info' && (
                                    <span className="absolute bottom-8 text-xs bg-yellow-200 text-black py-1 px-3 rounded-lg shadow-lg">
                                        Additional Info
                                    </span>
                                )}
                            </button>
                            <button
                                className="relative flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 mr-2"
                                onClick={handleAddDucks}
                                onMouseEnter={() => handleButtonMouseEnter('add')}
                                onMouseLeave={handleButtonMouseLeave}
                            >
                                <FiPlus className="text-lg" />
                                {hoveredButton === 'add' && (
                                    <span className="absolute bottom-8 text-xs bg-yellow-200 text-black py-1 px-3 rounded-lg shadow-lg">
                                        Add Ducks
                                    </span>
                                )}
                            </button>
                            <button
                                className="relative flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600"
                                onClick={handleRemoveDucks}
                                onMouseEnter={() => handleButtonMouseEnter('remove')}
                                onMouseLeave={handleButtonMouseLeave}
                            >
                                <FiMinus className="text-lg" />
                                {hoveredButton === 'remove' && (
                                    <span className="absolute bottom-8 text-xs bg-yellow-200 text-black py-1 px-3 rounded-lg shadow-lg">
                                        Remove Ducks
                                    </span>
                                )}
                            </button>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuckCard;
