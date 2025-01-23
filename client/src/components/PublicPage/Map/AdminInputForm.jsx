import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminInputForm.css';

const AdminInputForm = () => {
  const [formData, setFormData] = useState([]);
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState(new Date().getFullYear());
  const [existingYears, setExistingYears] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseColleges = await fetch('http://localhost:3001/api/colleges');
        const colleges = await responseColleges.json();
        setFormData(
          colleges.map((college) => ({
            id: college.id,
            name: college.name,
            totalKg: '',
          }))
        );

        const responseYears = await fetch('http://localhost:3001/api/waste-data-years');
        const years = await responseYears.json();
        setExistingYears(years);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (id, value) => {
    setFormData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, totalKg: value } : item))
    );
  };

  const handleSave = async () => {
    try {
      if (existingYears.includes(Number(year))) {
        alert(`Data for the year ${year} already exists. Please choose a different year.`);
        return;
      }

      const invalidEntries = formData.some((item) => !item.totalKg || item.totalKg.trim() === '');
      if (invalidEntries) {
        alert('Please fill in all "Total Solid Waste Generated" fields before saving.');
        return;
      }

      const payload = formData.map((item) => ({
        ...item,
        month,
        year,
      }));

      const response = await fetch('http://localhost:3001/api/waste-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowPopup(true);
        setExistingYears((prevYears) => [...prevYears, Number(year)]);
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data.');
    }
  };

  const handleGoBack = () => {
    setShowPopup(false);
    navigate('/waste-generators');
  };

  const handleStayOnPage = () => {
    setShowPopup(false);
  };

  return (
    <div className="admin-input-form">
      <h1>Solid Waste Generators</h1>
      <div className="filter-section">
        <label>
          Month:{' '}
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="filter-select">
            {[
              'January','February','March','April','May','June','July','August','September','October','November','December',
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
          Year:{' '}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2000"
            max="2100"
            className="filter-input"
          />
        </label>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>College Name</th>
            <th>Total Solid Waste Generated in Kg</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((college) => (
            <tr key={college.id}>
              <td>{college.name}</td>
              <td>
                <input
                  type="number"
                  value={college.totalKg}
                  onChange={(e) => handleInputChange(college.id, e.target.value)}
                  required
                  className="data-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <button onClick={handleSave} className="save-button">
          Save
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Data saved successfully!</h3>
            <div className="popup-buttons">
              <button onClick={handleGoBack} className="popup-button">
                Go back to Waste Generators Page
              </button>
              <button onClick={handleStayOnPage} className="popup-button">
                Stay on Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInputForm;




