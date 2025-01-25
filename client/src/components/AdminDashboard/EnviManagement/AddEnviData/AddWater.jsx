import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddWater() {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [source_tank, setSource_tank] = useState('');
    const [pH, setPH] = useState('');
    const [Color, setColor] = useState('');
    const [FecalColiform, setFecalColiform] = useState('');
    const [TSS, setTSS] = useState('');
    const [Chloride, setChloride] = useState('');
    const [Nitrate, setNitrate] = useState('');
    const [Phosphate, setPhosphate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [options_source_tank] = useState([
        "U-mall Water Tank",
        "Main Water Tank",
    ]);

    // Define month options
    const [options_month] = useState([
        { value: "", label: "Select Month Range" },
        { value: "January-June", label: "January - June" },
        { value: "July-December", label: "July - December" },
    ]);

    const validateInput = () => {
        // Check if year is a valid number and is a four-digit year
        if (!/^\d{4}$/.test(year)) {
            return "Please enter a valid four-digit year.";
        }
        // Check for valid month entry
        if (!month) { // Since it's a dropdown, no need to check trim
            return "Month range is required.";
        }
        // Check if source_tank is selected
        if (!source_tank) {
            return "Source Tank is required.";
        }
        // Check if residual, biodegradable, and recyclable are numbers
        if (
            isNaN(pH) ||
            isNaN(Color) ||
            isNaN(FecalColiform) ||
            isNaN(Nitrate) ||
            isNaN(Phosphate) ||
            isNaN(TSS) ||
            isNaN(Chloride)
        ) {
            return "All values must be valid numbers.";
        }
        // Check if any of the values are empty
        if (
            pH === '' ||
            Color === '' ||
            FecalColiform === '' ||
            TSS === '' ||
            Chloride === '' ||
            Nitrate === '' ||
            Phosphate === ''
        ) {
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

        axios.post("http://localhost:3001/add_waterquality", { year, month, source_tank, pH, Color, FecalColiform, TSS, Chloride, Nitrate, Phosphate })
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
        <div className="flex flex-col items-center justify-center min-h-screen font-main">
            <div className="dataContainer w-full max-w-4xl p-8 bg-white shadow-md rounded-md">
                <div className='justify-center'>
                    <form onSubmit={handleSubmit}>
                        <h4 className="text-2xl font-bold mb-4 text-center">Add Water Quality Data</h4>
                        <p className="text-center mb-4">(Do not include commas in values)</p>
                        {error && <p className="text-center mb-4" style={{ color: 'red' }}>{error}</p>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Year */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>Year:</label>
                                <input
                                    type="text"
                                    placeholder='Enter Year'
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </div>

                            {/* Month Range */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>Month Range:</label>
                                <select
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                >
                                    {options_month.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Source Tank */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>Source Tank:</label>
                                <select
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={source_tank}
                                    onChange={(e) => setSource_tank(e.target.value)}
                                >
                                    <option value="">Select Source Tank</option>
                                    {options_source_tank.map((source, index) => (
                                        <option key={index} value={source}>
                                            {source}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* pH */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>pH:</label>
                                <input
                                    type="text"
                                    placeholder='Enter pH'
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={pH}
                                    onChange={(e) => setPH(e.target.value)}
                                />
                            </div>

                            {/* Color */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>Color:</label>
                                <input
                                    type="text"
                                    placeholder='Enter Color Value'
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={Color}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                            </div>

                            {/* Fecal Coliform */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>Fecal Coliform:</label>
                                <input
                                    type="text"
                                    placeholder='Enter Fecal Coliform Value'
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={FecalColiform}
                                    onChange={(e) => setFecalColiform(e.target.value)}
                                />
                            </div>

                            {/* TSS */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>TSS:</label>
                                <input
                                    type="text"
                                    placeholder='Enter TSS Value'
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={TSS}
                                    onChange={(e) => setTSS(e.target.value)}
                                />
                            </div>

                            {/* Chloride */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>Chloride:</label>
                                <input
                                    type="text"
                                    placeholder='Enter Chloride Value'
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={Chloride}
                                    onChange={(e) => setChloride(e.target.value)}
                                />
                            </div>

                            {/* Nitrate */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>Nitrate:</label>
                                <input
                                    type="text"
                                    placeholder='Enter Nitrate Value'
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={Nitrate}
                                    onChange={(e) => setNitrate(e.target.value)}
                                />
                            </div>

                            {/* Phosphate */}
                            <div className='mb-4'>
                                <label className='block mb-2 font-bold'>Phosphate:</label>
                                <input
                                    type="text"
                                    placeholder='Enter Phosphate Value'
                                    className='form-control w-full p-2 border border-gray-300 rounded'
                                    value={Phosphate}
                                    onChange={(e) => setPhosphate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='flex justify-center'>
                            <button className='btn w-full p-2 bg-blue-500 text-white rounded'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddWater;
