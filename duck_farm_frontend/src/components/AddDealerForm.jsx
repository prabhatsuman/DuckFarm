import React, { useState } from 'react';
import API_URL from '../config';

const AddDealerForm = ({ onClose, onDealerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    email: '',
    phone_number: '',
    dealer_type: ''
  });
  const [isConfirming, setIsConfirming] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (isConfirming) {
      try {
        const response = await fetch(`${API_URL}/api/dealer_info/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(`${API_URL}:accessToken`)}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          onDealerAdded();
        } else {
          console.error('Failed to add dealer');
        }
      } catch (error) {
        console.error('Error adding dealer:', error);
      }
    } else {
      setIsConfirming(true);
    }
  };

  const handleEdit = () => {
    setIsConfirming(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {isConfirming ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirm Dealer Information</h2>
            <p className="mb-4"><strong>Name:</strong> {formData.name}</p>
            <p className="mb-4"><strong>Description:</strong> {formData.description}</p>
            <p className="mb-4"><strong>Address:</strong> {formData.address}</p>
            <p className="mb-4"><strong>Email:</strong> {formData.email}</p>
            <p className="mb-4"><strong>Phone Number:</strong> {formData.phone_number}</p>
            <p className="mb-4"><strong>Type:</strong> {formData.dealer_type}</p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-950 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Add Dealer Info</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Type</label>
              <input
                type="text"
                name="dealer_type"
                value={formData.dealer_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-950 text-white rounded-md"
              >
                Next
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDealerForm;
