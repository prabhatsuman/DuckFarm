import React, { useEffect, useState } from 'react';
import { FiMinus } from 'react-icons/fi';
import API_URL from '../config';

const DuckInfoPopup = ({ onClose }) => {
    const [duckInfo, setDuckInfo] = useState([]);

    useEffect(() => {
        fetchDuckInfo();
    }, []);

    const fetchDuckInfo = async () => {
        try {
            const response = await fetch(`${API_URL}/api/duck_info/`, {
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

    const handleDecreaseCount = async (duckId, gender) => {
        // Find the duck by id in the local duckInfo array
        const duckToUpdate = duckInfo.find(duck => duck.id === duckId);

        if (!duckToUpdate) {
            console.error('Duck not found');
            return;
        }

        // Ensure count doesn't go below 0
        const updatedCount = gender === 'male' ? Math.max(0, duckToUpdate.male_count - 1) : Math.max(0, duckToUpdate.female_count - 1);

        // Optimistically update local state with the decreased count
        const updatedDuckInfo = duckInfo.map(duck => {
            if (duck.id === duckId) {
                return {
                    ...duck,
                    male_count: gender === 'male' ? updatedCount : duck.male_count,
                    female_count: gender === 'female' ? updatedCount : duck.female_count
                };
            }
            return duck;
        });

        setDuckInfo(updatedDuckInfo);

        try {
            // Send PATCH request to update only male_count or female_count in database
            const response = await fetch(`${API_URL}/api/duck_info/${duckId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    [gender === 'male' ? 'male_count' : 'female_count']: updatedCount
                })
            });

            if (!response.ok) {
                console.error('Failed to update duck count in database', response.status, response.statusText);
                // Rollback local state change if update fails
                setDuckInfo(duckInfo);
            }
        } catch (error) {
            console.error('Error updating duck count:', error);
            // Rollback local state change if request fails
            setDuckInfo(duckInfo);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Duck Info</h2>
                <div className="overflow-y-auto max-h-64">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-center py-2">Breed</th>
                                <th className="text-center py-2">Male Count</th>
                                <th className="py-2"></th>
                                <th className="text-center py-2">Female Count</th>
                                <th className="text py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {duckInfo.map(duck => (
                                <tr key={duck.id}>
                                    <td className="py-2">{duck.breed}</td>
                                    <td className="py-2 px-2 float-end">
                                        <span>{duck.male_count} ducks</span>
                                    </td>
                                    <td>
                                        <button
                                            className={`px-2 py-1  bg-red-500 text-white rounded-md ${duck.male_count === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
                                            onClick={() => handleDecreaseCount(duck.id, 'male')}
                                            disabled={duck.male_count === 0}
                                        >
                                            <FiMinus />
                                        </button>
                                    </td>
                                    <td className="py-2 px-2 float-end">
                                       
                                        <span>{duck.female_count} ducks</span>
                                    </td>
                                    <td>
                                        <button
                                            className={`px-2 py-1  bg-red-500 text-white rounded-md ${duck.female_count === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
                                            onClick={() => handleDecreaseCount(duck.id, 'female')}
                                            disabled={duck.female_count === 0}
                                        >
                                            <FiMinus />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DuckInfoPopup;
