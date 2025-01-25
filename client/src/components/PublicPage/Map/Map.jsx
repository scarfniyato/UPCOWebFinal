import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import mapBackground from '../../../assets/CvSUMapCropped.png';
import locationPin from '../../../assets/locationPin.png';

const Map = () => {
  const [top10Data, setTop10Data] = useState([]);
  const [latestMonth, setLatestMonth] = useState('');
  const [latestYear, setLatestYear] = useState('');
  const [error, setError] = useState(null);

  const imageWidth = 1200;
  const imageHeight = 800;

  const bounds = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

  const markerData = [
    { id: 1, name: 'College of Engineering and Information Technology', lat: 260, lng: 875 },
    { id: 2, name: 'College of Agriculture, Forestry, Environment, and Natural Resources', lat: 410, lng: 900 },
    { id: 3, name: 'College of Arts and Sciences', lat: 365, lng: 838 },
    { id: 4, name: 'College of Veterinary Medicine and Biomedical Sciences', lat: 335, lng: 640 },
    { id: 5, name: 'College of Sports, Physical Education, and Recreation', lat: 410, lng: 1035 },
    { id: 6, name: 'College of Criminal Justice', lat: 205, lng: 980 },
    { id: 7, name: 'College of Economics, Management, and Development Studies Old Building', lat: 315, lng: 840 },
    { id: 8, name: 'College of Economics, Management, and Development Studies - New Building', lat: 457, lng: 890 },
    { id: 9, name: 'Open Graduate School', lat: 338, lng: 890 },
    { id: 10, name: 'College of Education', lat: 242, lng: 915 },
  ];

  const fetchLatestData = async () => {
    try {
      // Fetch the latest available month and year
      const response = await fetch('http://localhost:3001/api/latest-waste-data');
      if (!response.ok) throw new Error('Failed to fetch latest data.');
      const { month, year } = await response.json();
      setLatestMonth(month);
      setLatestYear(year);
    } catch (error) {
      console.error('Error fetching latest data:', error);
      setError('Failed to load latest data. Please try again later.');
    }
  };

  const colorCoding = ['#FF0000', '#FF4500', '#FFD700', '#ADFF2F', '#7FFF00', '#32CD32', '#228B22', '#006400', '#008080', '#2F4F4F'];

  const fetchTop10Data = async () => {
    if (!latestMonth || !latestYear) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/top10-waste-generators?month=${latestMonth}&year=${latestYear}`
      );
      if (!response.ok) throw new Error('Failed to fetch top 10 data.');
      const data = await response.json();
      setTop10Data(data);
    } catch (error) {
      console.error('Error fetching top 10 data:', error);
      setError('Failed to load data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  useEffect(() => {
    fetchTop10Data();
  }, [latestMonth, latestYear]);

  const getCustomMarker = (id) => {
    const index = top10Data.findIndex((college) => college.id === id);
    if (index === -1) return null;

    const color = colorCoding[index];

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative; width: 50px; height: 70px;">
          <div style="
            position: absolute;
            top: 20%;
            left: 28%;
            transform: translateX(-50%);
            border-radius: 50%;
            border: 3px solid ${color};
            box-shadow: 0 0 70px 45px ${color}80; 
          "></div>
          <img src="${locationPin}" alt="Location Pin" style="
            position: absolute;
            top: -5%;
            left: 28%;
            transform: translate(-50%, 0);
            width: 30px;
            height: 40px;
          "/>
        </div>
      `,
      iconSize: [30, 70],
    });
  };

  const years = [2021, 2022, 2023]; // Example years
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Example months
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1 className="text-center mb-2 fbold text-xl">CvSU - Main Map</h1>
      
      <div className="dropdowns my-4 text-left" data-html2canvas-ignore="true" style={{ display: 'flex', gap: '20px' }}>
        {/* Year Dropdown */}
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="year" className="mb-1 pr-2 fbold">Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="form-select"
            style={{ padding: '4px' }}
          >
            <option value="">Select Year</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Month Dropdown */}
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="month" className="mb-1 pr-2 fbold">Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="form-select"
            style={{ padding: '4px' }}
          >
            <option value="">Select Month</option>
            {months.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      <MapContainer
        center={[imageHeight / 2.3, imageWidth / 1.5]}
        zoom={0}
        minZoom={-1}
        scrollWheelZoom
        style={{
          height: '550px',
          width: '1000px',
        }}
        crs={L.CRS.Simple}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        <ImageOverlay url={mapBackground} bounds={bounds} />
        {markerData.map((marker) => {
          const customMarker = getCustomMarker(marker.id);

          return (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={customMarker || L.icon({ iconUrl: locationPin, iconSize: [30, 40] })}
            >
              <Popup>
                <h3>{marker.name}</h3>
                {top10Data.find((college) => college.id === marker.id) ? (
                  <>
                    <p>
                      <strong>Total Waste Generated:</strong>{' '}
                      {top10Data.find((college) => college.id === marker.id)?.totalKg} kg
                    </p>
                    <p>
                      <strong>Month:</strong> {latestMonth}
                    </p>
                    <p>
                      <strong>Year:</strong> {latestYear}
                    </p>
                  </>
                ) : (
                  <p>No data available</p>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
