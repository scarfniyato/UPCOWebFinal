import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateWaste() {
    const { id } = useParams();
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [residual, setResidual] = useState('');
    const [biodegradable, setBiodegradable] = useState('');
    const [recyclable, setRecyclable] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/get_solidwaste/${id}`)
            .then(result => {
                console.log(result);
                setYear(String(result.data.year));
                setMonth(result.data.month);
                setResidual(String(result.data.residual));
                setBiodegradable(String(result.data.biodegradable));
                setRecyclable(String(result.data.recyclable));
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
        if (!month || month.trim().length === 0) {
            return "Month is required.";
        }
        // Check if residual, biodegradable, and recyclable are valid numbers
        const residualNum = parseFloat(residual);
        const biodegradableNum = parseFloat(biodegradable);
        const recyclableNum = parseFloat(recyclable);

        if (isNaN(residualNum) || isNaN(biodegradableNum) || isNaN(recyclableNum)) {
            return "Residual, Biodegradable, and Recyclable must be valid numbers.";
        }
        // Check if any of the values are empty after trimming
        if (String(residual).trim() === '' || String(biodegradable).trim() === '' || String(recyclable).trim() === '') {
            return "All fields must be filled.";
        }
        // Optional: Check for non-negative numbers
        if (residualNum < 0 || biodegradableNum < 0 || recyclableNum < 0) {
            return "Quantities cannot be negative.";
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
            residual: Number(residual),
            biodegradable: Number(biodegradable),
            recyclable: Number(recyclable)
        };

        axios.put(`http://localhost:3001/update_solidwaste/${id}`, payload)
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
        <div className="bg">
            <div className="dataContainer" >
                <div className="text-center">
                <form onSubmit={handleUpdate}>
                <h4 className="text-2xl font-bold mb-4 text-center">Update Waste Data</h4>
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

            {/* Biodegradable */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">Biodegradable (kg):</label>
              <input
                type="number"
                placeholder="Enter Quantity"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={biodegradable}
                onChange={(e) => setBiodegradable(e.target.value)}
                min="0"
              />
            </div>

            {/* Recyclable */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">Recyclable (kg):</label>
              <input
                type="number"
                placeholder="Enter Quantity"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={recyclable}
                onChange={(e) => setRecyclable(e.target.value)}
                min="0"
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
export default UpdateWaste;