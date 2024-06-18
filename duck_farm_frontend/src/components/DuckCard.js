import React, { useState, useEffect } from 'react';
import { FiInfo, FiPlus } from 'react-icons/fi'; // Import icons from react-icons library
import AddDuckForm from './AddDuckForm'; // Import the AddDuckForm component
import DuckInfoPopup from './DuckInfoPopup'; // Import the DuckInfoPopup component

const DuckCard = ({ logoUrl }) => {
    const [totalDucks, setTotalDucks] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [showAddDuckForm, setShowAddDuckForm] = useState(false);
    const [showDuckInfoPopup, setShowDuckInfoPopup] = useState(false); // State to toggle DuckInfoPopup

    useEffect(() => {
        fetchTotalDucks();
    }, []);

    const fetchTotalDucks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/duck_info/total/', {
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

    const handleAddDucks = () => {
        setShowAddDuckForm(true);
    };

    const handleDuckAdded = () => {
        setShowAddDuckForm(false);
        fetchTotalDucks(); // Refresh the total ducks count
    };

    const handleShowDuckInfo = () => {
        setShowDuckInfoPopup(true);
    };

    const handleCloseDuckInfo = () => {
        setShowDuckInfoPopup(false);
        fetchTotalDucks(); // Refresh the total ducks count when closing DuckInfoPopup
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
                                <p className="mt-2 text-sm text-gray-500 text-right">{totalDucks} ducks</p>
                            </div>
                        ) : (
                            <div className="flex items-center mt-4">
                                <button
                                    className="relative flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 mr-2"
                                    onMouseEnter={() => handleButtonMouseEnter('info')}
                                    onMouseLeave={handleButtonMouseLeave}
                                    onClick={handleShowDuckInfo} // Show DuckInfoPopup onClick
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showAddDuckForm && (
                <AddDuckForm
                    onClose={() => setShowAddDuckForm(false)}
                    onDuckAdded={handleDuckAdded}
                />
            )}
            {showDuckInfoPopup && (
                <DuckInfoPopup onClose={handleCloseDuckInfo} />
            )}
        </div>
    );
};

export default DuckCard;
