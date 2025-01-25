import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddAir() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [CO, setCO] = useState('');
  const [NO2, setNO2] = useState('');
  const [SO2, setSO2] = useState('');
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
    // Check if CO, NO2, and SO2 are numbers
    if (isNaN(CO) || isNaN(NO2) || isNaN(SO2)) {
      return "CO, NO2, and SO2 must be valid numbers.";
    }
    // Check if any of the values are empty
    if (CO.trim() === '' || NO2.trim() === '' || SO2.trim() === '') {
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

    axios.post("http://localhost:3001/add_airquality", { 
      year, 
      month, 
      CO, 
      NO2, 
      SO2 
    })
      .then(result => {
        console.log(result);
        navigate('/enviair');
        alert("Data Added Successfully!");
      })
      .catch(err => {
        // Check if the server sent a custom error message
        if (err.response && err.response.data && err.response.data.error) {
          setError();
          alert("Data for this year and month already exists.");
        } else {
          setError('Failed to create data. Please try again.');
        }
        console.log(err);
      });    
  };

  return (
    <div>
      <div className="dataContainer" >
      <div className='text-center'>
        <form onSubmit={handleSubmit}>
          <h4><strong>Add Air Quality Data</strong></h4>
          <p>(Do not include commas in values)</p>
          {error && <p className="text-danger">{error}</p>}

          {/* Year */}
          <div className='mb-2'>
            <label>Year:</label>
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
            <label>Month:</label>
            <select
              className='form-control'
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

          <div className='mb-2'>
            <label>CO:</label>
            <input 
              type="text" 
              placeholder='Enter Data' 
              className='form-control'
              value={CO}
              onChange={(e) => setCO(e.target.value)}
            />
          </div>

          <div className='mb-2'>
            <label>NO2:</label>
            <input 
              type="text" 
              placeholder='Enter Data' 
              className='form-control'
              value={NO2}
              onChange={(e) => setNO2(e.target.value)}
            />
          </div>

          <div className='mb-2'>
            <label>SO2:</label>
            <input 
              type="text" 
              placeholder='Enter Data' 
              className='form-control'
              value={SO2}
              onChange={(e) => setSO2(e.target.value)}
            />
          </div>

          <button className='btn'>Submit</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AddAir;
