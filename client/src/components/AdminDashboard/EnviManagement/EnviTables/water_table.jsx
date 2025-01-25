// WaterQualityTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For programmatic navigation

// **Define constants outside the component**
const PARAMETERS = ["pH", "Color", "FecalColiform", "TSS", "Chloride", "Nitrate", "Phosphate"];
const SOURCE_TANKS = ["U-mall Water Tank", "Main Water Tank"];

function WaterQualityTable({ onMonthYearChange }) {
    // State variables
    const [allData, setAllData] = useState([]);
    const [selectedMonthRange, setSelectedMonthRange] = useState("January-June");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
    const [aggregatedData, setAggregatedData] = useState({});
    const [availableYears, setAvailableYears] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Define month options with value and label
    const monthOptions = [
        { value: 'January-June', label: 'January - June' },
        { value: 'July-December', label: 'July - December' },
    ];

    // Fetch available years from the backend
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get('http://localhost:3001/available_years');
                const sortedYears = response.data.sort((a, b) => b - a); // Descending order
                setAvailableYears(sortedYears);
                if (sortedYears.length > 0) {
                    setSelectedYear(sortedYears[0]); // Set to the latest year
                }
            } catch (error) {
                console.error("Error fetching available years:", error);
                // Optionally, set default years if fetching fails
                setAvailableYears([2023, 2024, 2025]);
                setSelectedYear(2025);
            }
        };

        fetchYears();
    }, []);

    // Define year options based on available years
    const yearOptions = availableYears.map(year => ({
        value: year,
        label: year.toString(),
    }));

    // Helper function to format numbers without trailing zeros
    const formatNumber = (num) => {
        if (typeof num !== 'number') return num; // Handle non-number cases like "N/A"
        return parseFloat(num.toFixed(2)).toString();
    };

    // Fetch data based on selected month range and year
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:3001/waterquality_data', {
                    params: {
                        monthRange: selectedMonthRange,
                        year: selectedYear,
                    }
                });
                setAllData(response.data);
            } catch (error) {
                console.error("Error fetching water quality data:", error);
                setAllData([]); // Clear data on error
                setError("Failed to fetch water quality data.");
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if a year is selected
        if (selectedYear) {
            fetchData();
        }
    }, [selectedMonthRange, selectedYear]);

    // Aggregate data whenever allData changes
    useEffect(() => {
        const aggregate = () => {
            const aggregation = {};

            PARAMETERS.forEach(param => {
                aggregation[param] = {};
                SOURCE_TANKS.forEach(tank => {
                    // Find data for the specific tank and parameter
                    const tankData = allData.find(item => item.source_tank === tank);
                    if (tankData && tankData[param] != null) { // Access the correct field
                        aggregation[param][tank] = formatNumber(tankData[param]);
                    } else {
                        aggregation[param][tank] = "N/A";
                    }
                });
            });

            setAggregatedData(aggregation);
        };

        aggregate();
    }, [allData]);

    useEffect(() => {
        // Only call if the parent gave us a callback
        if (onMonthYearChange) {
          onMonthYearChange(selectedMonthRange, selectedYear);
        }
      }, [selectedMonthRange, selectedYear, onMonthYearChange]);

    // Handle Update Action per Tank
    const handleUpdate = (tankId) => {
        navigate(`/update/water/${tankId}`);
    };

    // Organize data by tank
    const uMallData = allData.find(record => record.source_tank === "U-mall Water Tank");
    const mainTankData = allData.find(record => record.source_tank === "Main Water Tank");

    return (
        <div className="" style={{ color: '#333333' }}>
            {/* Filters: Month Range and Year */}
            <div className="dropdowns" data-html2canvas-ignore="true" style={{ margin: '20px 0', textAlign: 'left' }}>
                <div className="dropdown-row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '20px' }}>
                    {/* Dropdown for selecting year */}
                    <div className="dropdown" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="yearSelect" style={{ marginBottom: '5px' }}>Year:</label>
                        <select
                            id="yearSelect"
                            className="form-select"
                            value={selectedYear || ''}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                            style={{ fontSize: '16px', padding: '4px', width: '100%' }}
                        >
                            <option value="" disabled>Select Year</option>
                            {yearOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    
                    <div className="dropdown" data-html2canvas-ignore="true" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="monthRangeSelect" style={{ marginBottom: '5px' }}>Month:</label>
                        <select
                            id="monthRangeSelect"
                            className="form-select"
                            value={selectedMonthRange}
                            onChange={(e) => setSelectedMonthRange(e.target.value)}
                            style={{ fontSize: '16px', padding: '4px', width: '200px' }} // Increased width
                        >
                            {monthOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : allData.length === 0 ? (
                <p>No data available for the selected month range and year.</p>
            ) : (
                /* Table displaying aggregated data */
                <table className="table table-bordered table-striped">
                    <thead className="">
                        <tr>
                            <th>Parameter</th>
                            {SOURCE_TANKS.map((tank, index) => (
                                <th key={index}>{tank}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PARAMETERS.map((param, index) => (
                            <tr key={index}>
                                <td>{param === "FecalColiform" ? "Fecal Coliform" : param}</td> {/* Display name properly */}
                                {SOURCE_TANKS.map((tank, idx) => (
                                    <td key={idx}>{aggregatedData[param] ? aggregatedData[param][tank] : "N/A"}</td>
                                ))}
                            </tr>
                        ))}
                        {/* Actions Row */}
                        <tr data-html2canvas-ignore="true">
                            <td><strong>Actions</strong></td>
                            {SOURCE_TANKS.map((tank, idx) => {
                                const tankData = tank === "U-mall Water Tank" ? uMallData : mainTankData;
                                return (
                                    <td key={idx}>
                                        {tankData ? (
                                            <>
                                                <button
                                                    className="update-btn"
                                                    onClick={() => handleUpdate(tankData._id)}
                                                >
                                                    Update
                                                </button>
                                            </>
                                        ) : (
                                            "No Data"
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default WaterQualityTable;
