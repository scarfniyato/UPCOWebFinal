import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateWater() {
    const { id } = useParams();
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

    useEffect(() => {
        axios.get(`http://localhost:3001/get_water/${id}`)
            .then(result => {
                console.log(result);
                setYear(String(result.data.year));
                setMonth(result.data.month);
                setSource_tank(String(result.data.source_tank));
                setPH(String(result.data.pH));
                setColor(String(result.data.Color));
                setFecalColiform(String(result.data.FecalColiform));
                setTSS(String(result.data.TSS));
                setChloride(String(result.data.Chloride));
                setNitrate(String(result.data.Nitrate));
                setPhosphate(String(result.data.Phosphate));
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
            source_tank,
            pH: Number(pH),
            Color: Number(Color),
            FecalColiform: Number(FecalColiform),
            TSS: Number(TSS),
            Chloride: Number(Chloride),
            Nitrate: Number(Nitrate),
            Phosphate: Number(Phosphate)
        };

        axios.put(`http://localhost:3001/update_water/${id}`, payload)
            .then(result => {
                console.log(result);
                navigate('/enviwater');
                alert("Data Updated Successfully!")
            })
            .catch(err => {
                console.log(err);
                setError("An error occurred while updating the data.");
            });
    };

    return (
        <div>
            <div className="container w-2/5">
                <div className="row items-center ">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                        <div className="dataContainer">
                            <div className='text-left pl-5'>
                                <form onSubmit={handleUpdate}>
                                    <h4><strong>Update Water Quality Data </strong></h4> <p>(Do not include commas in values)</p><br/>
                                    {error && <p className="text-danger">{error}</p>}
                                    
                                    <div className="row font-main">
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">Year:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Year'
                                                className='form-control'
                                                value={year}
                                                readOnly 
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">Month Range:</label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={month}
                                                readOnly 
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="sourceTankSelect" className="form-label fbold pr-2">
                                                Source Tank:
                                            </label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={source_tank}
                                                readOnly 
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">pH:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter pH'
                                                className='form-control'
                                                value={pH}
                                                onChange={(e) => setPH(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">Color:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Color Value'
                                                className='form-control'
                                                value={Color}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">Fecal Coliform:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Fecal Coliform Value'
                                                className='form-control'
                                                value={FecalColiform}
                                                onChange={(e) => setFecalColiform(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">TSS:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter TSS Value'
                                                className='form-control'
                                                value={TSS}
                                                onChange={(e) => setTSS(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">Chloride:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Chloride Value'
                                                className='form-control'
                                                value={Chloride}
                                                onChange={(e) => setChloride(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">Nitrate:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Nitrate Value'
                                                className='form-control'
                                                value={Nitrate}
                                                onChange={(e) => setNitrate(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className='col-md-6 mb-3'>
                                            <label className="fbold pr-2">Phosphate:</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Phosphate Value'
                                                className='form-control'
                                                value={Phosphate}
                                                onChange={(e) => setPhosphate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className='btn w-full'>Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateWater;
