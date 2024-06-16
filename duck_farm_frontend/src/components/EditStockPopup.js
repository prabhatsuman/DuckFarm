import React, { useState, useEffect } from 'react';

const EditStockPopup = ({ item, stockType, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...item });

  useEffect(() => {
    setFormData({ ...item });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/stocks/${stockType}/${item.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        onUpdate(updatedItem);
        onClose();
      } else {
        console.error(`Failed to update ${stockType} item`);
      }
    } catch (error) {
      console.error(`Error updating ${stockType} item:`, error);
    }
  };

  const renderFields = () => {
    switch (stockType) {
      case 'feed':
      case 'medicine':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date of Purchase</label>
              <input
                type="date"
                name="date_of_purchase"
                value={formData.date_of_purchase || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            {stockType === 'medicine' && (
              <div className="mb-4">
                <label className="block text-gray-700">Date of Expiry</label>
                <input
                  type="date"
                  name="date_of_expiry"
                  value={formData.date_of_expiry || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
            )}
          </>
        );
      case 'other':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date of Purchase</label>
              <input
                type="date"
                name="date_of_purchase"
                value={formData.date_of_purchase || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit {stockType.charAt(0).toUpperCase() + stockType.slice(1)} Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          {renderFields()}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Update {stockType.charAt(0).toUpperCase() + stockType.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockPopup;
