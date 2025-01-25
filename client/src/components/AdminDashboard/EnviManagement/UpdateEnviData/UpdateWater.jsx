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
            <div className="flex flex-col items-center justify-center min-h-screen font-main">
            <div className="dataContainer max-w-4xl p-8 bg-white shadow-md rounded-md">
                <div className='justify-center'>
                                <form onSubmit={handleUpdate}>

                                <h4 className="text-2xl font-bold mb-4 text-center">Update Water Quality Data</h4>
            <p className="text-center mb-4">(Do not include commas in values)</p>
            {error && <p className="text-center mb-4" style={{ color: 'red' }}>{error}</p>}

            <div className="mb-4">
              <label className="block mb-2 font-bold">Year:</label>
              <input
                type="text"
                placeholder="Enter Year"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={year}
                readOnly
              />
            </div>

            <div className="mb-4">
                                             <label className="fbold pr-2">Month Range:</label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                value={month}
                                                readOnly 
                                            />
            </div>

            <div className="mb-4">
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

            <div className="mb-4">
              <label className="block mb-2 font-bold">pH:</label>
              <input
                type="text"
                placeholder="Enter pH"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={pH}
                onChange={(e) => setPH(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Color:</label>
              <input
                type="text"
                placeholder="Enter Color Value"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={Color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Fecal Coliform:</label>
              <input
                type="text"
                placeholder="Enter Fecal Coliform Value"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={FecalColiform}
                onChange={(e) => setFecalColiform(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">TSS:</label>
              <input
                type="text"
                placeholder="Enter TSS Value"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={TSS}
                onChange={(e) => setTSS(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Chloride:</label>
              <input
                type="text"
                placeholder="Enter Chloride Value"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={Chloride}
                onChange={(e) => setChloride(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Nitrate:</label>
              <input
                type="text"
                placeholder="Enter Nitrate Value"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={Nitrate}
                onChange={(e) => setNitrate(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Phosphate:</label>
              <input
                type="text"
                placeholder="Enter Phosphate Value"
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={Phosphate}
                onChange={(e) => setPhosphate(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <button className="btn w-full p-2 bg-blue-500 text-white rounded">Submit</button></div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
    );
}

export default UpdateWater;
