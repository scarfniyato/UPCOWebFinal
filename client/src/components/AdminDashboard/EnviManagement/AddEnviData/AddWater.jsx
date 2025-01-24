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

        axios.post("http://localhost:3001/add_waterquality", { 
            year, 
            month, 
            source_tank, 
            pH, 
            Color, 
            FecalColiform, 
            TSS, 
            Chloride, 
            Nitrate, 
            Phosphate 
        })
          .then(result => {
            console.log(result);
            navigate('/enviwater');
            alert("Data Added Successfully!");
          })
          .catch(err => {
            // Check if the server responded with a custom error field
            if (err.response && err.response.data && err.response.data.error) {
              setError();
              alert("Data for this year and month already exists.");
            } else {
              setError('Failed to create data. Please try again.');
            }
            console.error(err);
          });        
    };

    return (
        <div className='bg'>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="dataContainer">
                            <div className='text-center'>
                                <form onSubmit={handleSubmit}>
                                    <h4><strong>Add Water Quality Data </strong></h4> <p>(Do not include commas in values)</p>
                                    {error && <p className="text-danger">{error}</p>}
                                    
                                    <div className="row">
                                        <div className='col-md-6 mb-3'>
                                            <label>Year:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Year'
                                                className='form-control'
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label>Month Range:</label>
                                            <select
                                                className='form-control'
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

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="sourceTankSelect" className="form-label">
                                                Source Tank:
                                            </label>
                                            <select
                                                id="sourceTankSelect"
                                                className="form-select"
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
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label>pH:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter pH'
                                                className='form-control'
                                                value={pH}
                                                onChange={(e) => setPH(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label>Color:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Color Value'
                                                className='form-control'
                                                value={Color}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label>Fecal Coliform:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Fecal Coliform Value'
                                                className='form-control'
                                                value={FecalColiform}
                                                onChange={(e) => setFecalColiform(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label>TSS:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter TSS Value'
                                                className='form-control'
                                                value={TSS}
                                                onChange={(e) => setTSS(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label>Chloride:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Chloride Value'
                                                className='form-control'
                                                value={Chloride}
                                                onChange={(e) => setChloride(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label>Nitrate:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Nitrate Value'
                                                className='form-control'
                                                value={Nitrate}
                                                onChange={(e) => setNitrate(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label>Phosphate:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Phosphate Value'
                                                className='form-control'
                                                value={Phosphate}
                                                onChange={(e) => setPhosphate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <button type="submit" className='btn'>Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddWater;
