// DuckCard.js
import React, { useState,useEffect } from 'react';
import { useQuery } from 'react-query';
import { FiInfo, FiPlus, FiChevronDown } from 'react-icons/fi';
import AddDuckForm from './AddDuckForm';
import DuckInfoPopup from './DuckInfoPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDove} from '@fortawesome/free-solid-svg-icons';
import API_URL from '../config';
const fetchTotalDucks = async () => {
    const response = await fetch(`${API_URL}/api/duck_info/total/`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem(`${API_URL}:accessToken`)}`,
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const DuckCard = () => {
    const [showAddDuckForm, setShowAddDuckForm] = useState(false);
    const [showDuckInfoPopup, setShowDuckInfoPopup] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const { data, error, isLoading, refetch } = useQuery(['totalDucks'], fetchTotalDucks, {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    const handleToggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleAddDucks = () => {
        setShowAddDuckForm(true);
        setShowOptions(false);
    };

    const handleShowDuckInfo = () => {
        setShowDuckInfoPopup(true);
        setShowOptions(false);
    };

    const handleCloseDuckInfo = () => {
        setShowDuckInfoPopup(false);
        refetch(); // Refresh the total ducks count when closing DuckInfoPopup
    };

    const handleOutsideClick = (e) => {
        if (!e.target.closest(".options-container") && !e.target.closest(".options-toggle")) {
            setShowOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <div className="px-4 py-5 sm:p-6 relative">
            <div className="absolute top-4 right-1 z-20">
                <button
                    className="text-gray-600 hover:text-gray-800 focus:outline-none options-toggle"
                    onClick={handleToggleOptions}
                >
                    <FiChevronDown className="text-xs" />
                </button>
                {showOptions && (
                    <div
                        className="absolute bg-white border border-gray-200 shadow-lg rounded-lg z-30 options-container"
                        style={{ right: 20, top: 10 }}
                    >
                        <button
                            className="block py-2.5 px-4 rounded hover:bg-gray-100 w-full text-left truncate"
                            onClick={handleShowDuckInfo}
                        >
                            <FiInfo className="inline-block mr-2" /> Additional Info
                        </button>
                        <button
                            className="block py-2.5 px-4 rounded hover:bg-gray-100 w-full text-left truncate"
                            onClick={handleAddDucks}
                        >
                            <FiPlus className="inline-block mr-2" /> Add Ducks
                        </button>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between">
                <div className="mt-4">
                    <h3 className="text-xl font-medium text-gray-900">Total Ducks</h3>
                    <p className="mt-2 text-black text-left">{data.total} ducks</p>
                </div>
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faDove} size="5x"  className="text-blue-950" />
                </div>
            </div>
            {showAddDuckForm && (
                <AddDuckForm
                    onClose={() => setShowAddDuckForm(false)}
                    onDuckAdded={() => {
                        setShowAddDuckForm(false);
                        refetch(); // Refresh the total ducks count
                    }}
                />
            )}
            {showDuckInfoPopup && <DuckInfoPopup onClose={handleCloseDuckInfo} />}
        </div>
    );
};

export default DuckCard;
