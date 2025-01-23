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
        navigate('/');
      })
      .catch(err => {
        console.log(err);
        setError('Failed to create data. Please try again.');
      });
  };

  return (
    <div className="flex flex-col items-center justify-center font-main">
      <div className="dataContainer w-1/2">
        <div className='justify-center ml-10'>
          <form onSubmit={handleSubmit}>
            <h4 className="text-xl"><strong>Add Solid Waste Data</strong></h4>
            <p>(Do not include commas in values)</p><br/>
            {error && <p className="text-danger">{error}</p>}

            {/* Year */}
            <div className='mb-2'>
              <label  className='mr-2 fbold'>Year:</label>
              <input
                type="text"
                placeholder='Enter Year'
                className='form-control'
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            {/* Month (Dropdown) */}
            <div className='mb-2'>
              <label className='mr-2 fbold'>Month:</label>
              <select
                className='form-control dropdown text-sm'
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
            <div className='mb-2'>
              <label className='mr-2 fbold'>Residual (kg):</label>
              <input
                type="text"
                placeholder='Enter Quantity'
                className='form-control'
                value={residual}
                onChange={(e) => setResidual(e.target.value)}
              />
            </div>

            {/* Recyclable */}
            <div className='mb-2'>
              <label className='mr-2 fbold'>Recyclable (kg):</label>
              <input
                type="text"
                placeholder='Enter Quantity'
                className='form-control'
                value={recyclable}
                onChange={(e) => setRecyclable(e.target.value)}
              />
            </div>

            {/* Biodegradable */}
            <div className='mb-2'>
              <label className='mr-2 fbold'>Biodegradable (kg):</label>
              <input
                type="text"
                placeholder='Enter Quantity'
                className='form-control'
                value={biodegradable}
                onChange={(e) => setBiodegradable(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button className='btn'>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddWaste;
