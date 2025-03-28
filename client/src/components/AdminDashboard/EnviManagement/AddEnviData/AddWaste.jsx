import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddWaste() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [residual, setResidual] = useState('');
  const [biodegradable, setBiodegradable] = useState('');
  const [recyclable, setRecyclable] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // List of months for the dropdown
  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const validateInput = () => {
    // Check if year is a valid number and is a four-digit year
    if (!/^\d{4}$/.test(year)) {
      return "Please enter a valid four-digit year.";
    }
    // Check for valid month entry
    if (!month || month.trim().length === 0) {
      return "Month is required.";
    }
    // Check if residual, biodegradable, and recyclable are numbers
    if (isNaN(residual) || isNaN(biodegradable) || isNaN(recyclable)) {
      return "Residual, Biodegradable, and Recyclable must be valid numbers.";
    }
    // Check if any of the values are empty
    if (residual.trim() === '' || biodegradable.trim() === '' || recyclable.trim() === '') {
      return "All fields must be filled.";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMessage = validateInput();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setError(''); // Clear any existing errors

    axios.post("http://localhost:3001/add_solidwaste", { 
      year, 
      month, 
      residual, 
      biodegradable, 
      recyclable 
    })
      .then(result => {
        console.log(result);
        navigate('/dashboard/waste');
        alert("Data Added Successfully!");
      })
      .catch(err => {
        // If the server sends back a response with a custom error, display that
        if (err.response && err.response.data && err.response.data.error) {
          setError();
          alert("Data for this year and month already exists.");
        } else {
          setError('Failed to create data. Please try again.');
        }
      });    
  };

  return (
    <div className="flex flex-col items-left justify-left min-h-screen font-main text-xs">
      <div className="dataContainer w-full max-w-md p-8 bg-white shadow-md rounded-md ">
        <div className='justify-left p-5'>
          <form onSubmit={handleSubmit}>
            <h4 className="text-xl font-bold mb-4 text-left">Add Solid Waste Data</h4>
            <p className="text-left -mt-3 mb-5">(Do not include commas in values)</p>
            {error && <p className="text-left mb-4" style={{ color: 'red' }}>{error}</p>}

            {/* Year */}
            <div className='mb-4'>
              <label className='block mb-2 font-bold'>Year:</label>
              <input
                type="text"
                placeholder='Enter Year'
                className='form-control w-[335px] p-2 border border-gray-300 rounded'
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            {/* Month (Dropdown) */}
            <div className='mb-4'>
              <label className='block mb-2 font-bold'>Month:</label>
              <select
                className='form-control w-[335px] p-2 border border-gray-300 rounded'
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {monthsList.map((m, idx) => (
                  <option key={idx} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Residual */}
            <div className='mb-4'>
              <label className='block mb-0 font-bold'>Residual (kg):</label>
              <input
                type="text"
                placeholder='Enter Quantity'
                className='form-control w-[335px] p-2 border border-gray-300 rounded'
                value={residual}
                onChange={(e) => setResidual(e.target.value)}
              />
            </div>

            {/* Recyclable */}
            <div className='mb-4'>
              <label className='block mb-0 font-bold'>Recyclable (kg):</label>
              <input
                type="text"
                placeholder='Enter Quantity'
                className='form-control w-[335px] p-2 border border-gray-300 rounded'
                value={recyclable}
                onChange={(e) => setRecyclable(e.target.value)}
              />
            </div>

            {/* Biodegradable */}
            <div className='mb-4'>
              <label className='block mb-0 font-bold'>Biodegradable (kg):</label>
              <input
                type="text"
                placeholder='Enter Quantity'
                className='form-control w-[335px] p-2 border border-gray-300 rounded'
                value={biodegradable}
                onChange={(e) => setBiodegradable(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-left'>
              <button className='btn w-full p-2 bg-blue-500 text-white rounded'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddWaste;
