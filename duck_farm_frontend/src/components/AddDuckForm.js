import React, { useState, useEffect } from 'react';

const AddDuckForm = ({ onClose, onDuckAdded }) => {
  const [formData, setFormData] = useState({
    breed: '',
    male_count: '',
    female_count: '',
    dealer: '',
    purchase_date: '',
    price_per_piece: ''
  });
  const [breeds, setBreeds] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [isOtherBreed, setIsOtherBreed] = useState(false);

  useEffect(() => {
    fetchBreeds();
    fetchDealers();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/duck_info/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setBreeds(data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  const fetchDealers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/dealer_info/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setDealers(data);
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBreedChange = e => {
    const value = e.target.value;
    if (value === 'other') {
      setIsOtherBreed(true);
      setFormData(prevState => ({
        ...prevState,
        breed: ''
      }));
    } else {
      setIsOtherBreed(false);
      setFormData(prevState => ({
        ...prevState,
        breed: value
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const selectedBreed = breeds.find(breed => breed.breed === formData.breed);

    if (selectedBreed) {
      // Update the count of the existing breed
      const updatedFormData = {
        ...formData,
        male_count: parseInt(formData.male_count, 10) + selectedBreed.male_count,
        female_count: parseInt(formData.female_count, 10) + selectedBreed.female_count
      };

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/duck_info/${selectedBreed.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(updatedFormData)
        });

        if (response.ok) {
          onDuckAdded();
        } else {
          console.error('Failed to update duck');
        }
      } catch (error) {
        console.error('Error updating duck:', error);
      }
    } else {
      // Add a new breed
      try {
        const response = await fetch('http://127.0.0.1:8000/api/duck_info/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          onDuckAdded();
        } else {
          console.error('Failed to add duck');
        }
      } catch (error) {
        console.error('Error adding duck:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Duck Info</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Breed</label>
            <select
              name="breed"
              value={isOtherBreed ? 'other' : formData.breed}
              onChange={handleBreedChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="">Select Breed</option>
              {breeds.map(breed => (
                <option key={breed.breed} value={breed.breed}>
                  {breed.breed}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
            {isOtherBreed && (
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md mt-2"
                placeholder="Enter breed name"
                required
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Male Count</label>
            <input
              type="number"
              name="male_count"
              value={formData.male_count}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Female Count</label>
            <input
              type="number"
              name="female_count"
              value={formData.female_count}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Dealer</label>
            <select
              name="dealer"
              value={formData.dealer}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="">Select Dealer</option>
              {dealers.map(dealer => (
                <option key={dealer.id} value={dealer.id}>
                  {dealer.name} ({dealer.dealer_type})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price per Piece</label>
            <input
              type="number"
              name="price_per_piece"
              value={formData.price_per_piece}
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Duck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDuckForm;
