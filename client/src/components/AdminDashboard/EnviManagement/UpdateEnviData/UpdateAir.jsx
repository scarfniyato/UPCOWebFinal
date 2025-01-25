import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateAir() {
    const { id } = useParams();
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [CO, setCO] = useState('');
    const [NO2, setNO2] = useState('');
    const [SO2, setSO2] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/get_air/${id}`)
            .then(result => {
                console.log(result);
                setYear(String(result.data.year));
                setMonth(result.data.month);
                setCO(String(result.data.CO));
                setNO2(String(result.data.NO2));
                setSO2(String(result.data.SO2));
            })
            .catch(err => {
                console.log(err);
                setError("Failed to fetch data.");
            });
    }, [id]);

    const validateInput = () => {
        // Check if year is a valid number and is a four-digit year
        if (!/^\d{4}$/.test(year)) {
            return "Please enter a valid four-digit year.";
        }
        // Check for valid month entry
        if (!month) { // Since it's a dropdown, no need to check trim
            return "Month range is required.";
        }
        // Check if residual, biodegradable, and recyclable are numbers
        if (
            isNaN(CO) ||
            isNaN(NO2) ||
            isNaN(SO2) 
        ) {
            return "All values must be valid numbers.";
        }
        // Check if any of the values are empty
        if (
            CO === '' ||
            NO2 === '' ||
            SO2 === '' 
        ) {
            return "All fields must be filled.";
        }
        return null;
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const errorMessage = validateInput();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        setError(''); // Clear any existing errors

        // Convert numerical fields back to numbers
        const payload = {
            year: Number(year),
            month,
            CO: Number(CO),
            NO2: Number(NO2),
            SO2: Number(SO2),
        };

        axios.put(`http://localhost:3001/update_air/${id}`, payload)
            .then(result => {
                console.log(result);
                navigate('/');
            })
            .catch(err => {
                console.log(err);
                setError("An error occurred while updating the data.");
            });
    };

    return (
        <div className='bg'>
            <div className="dataContainer" >
            <div className='text-center'>
                <form onSubmit={handleUpdate}>
                <h4 className="text-2xl font-bold mb-4 text-center">Update Air Quality Data</h4>
            <p className="text-center mb-4">(Do not include commas in values)</p>
            {error && <p className="text-center mb-4" style={{ color: 'red' }}>{error}</p>}

            {/* Year */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">Year:</label>
              <input
                type="text"
                placeholder="Enter Year"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            {/* NO2 */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">NO2:</label>
              <input
                type="text"
                placeholder="Enter Data"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={NO2}
                onChange={(e) => setNO2(e.target.value)}
              />
            </div>

            {/* SO2 */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">SO2:</label>
              <input
                type="text"
                placeholder="Enter Data"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={SO2}
                onChange={(e) => setSO2(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button className="btn w-full p-2 bg-blue-500 text-white rounded">Submit</button>
            </div>
                </form>
            </div>
        </div>
        </div>
    );
}

export default UpdateAir;
