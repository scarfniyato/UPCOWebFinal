import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapBackground from '../../../assets/CvSUMapCropped.png';
import locationPin from '../../../assets/locationPin.png';
import * as d3 from 'd3'; // Import D3 for colorScale

const Map = () => {
  const [top10Data, setTop10Data] = useState([]);
  const [latestMonth, setLatestMonth] = useState('');
  const [latestYear, setLatestYear] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch the top 10 waste-generating data
  const fetchTop10Data = async () => {
    if (!latestMonth || !latestYear) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/top10-waste-generators?month=${latestMonth}&year=${latestYear}`
      );
      if (!response.ok) throw new Error('Failed to fetch top 10 data.');
      const data = await response.json();
      setTop10Data(data);
      setIsLoading(false); // Data fetched successfully
    } catch (error) {
      console.error('Error fetching top 10 data:', error);
      setError('Failed to load data. Please try again later.');
      setIsLoading(false);
    }
  };

  // Fetch the latest available month and year
  const fetchLatestData = async () => {
    try {
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

  // D3 color scale for waste data (this will match the one in top10TableList.jsx)
  const colorScale = d3
    .scaleSequential(d3.interpolateYlOrRd)
    .domain([Math.min(...top10Data.map((d) => d.totalKg || 0)), Math.max(...top10Data.map((d) => d.totalKg || 1))]);

  // Create custom marker for map
  const getCustomMarker = (id) => {
    const index = top10Data.findIndex((college) => college.id === id);
    if (index === -1) return null;

    // Get the color from the colorScale using totalKg
    const color = colorScale(top10Data[index].totalKg);

    // Return the custom marker with background color
    return L.divIcon({
      className: 'custom-marker',
      html: `
       <div style="position: relative; width: 50px; height: 70px; ">
          <div style="
            position: absolute;
            width: 100px; 
            height: 100px;
            top: -40%;
            left: 28%;
            transform: translateX(-50%);
            border-radius: 100%;
            background-color: ${color};
            border: 3px solid ${color};
            box-shadow: 
              0 0 30px 15px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.2), 
      0 0 50px 20px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.4),
      0 0 70px 30px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.6),
      0 0 90px 40px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.8),
      0 0 120px 50px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 1);
          "></div>
          <img src="${locationPin}" alt="Location Pin" style="
            position: absolute;
            top: -5%;
            left: 28%;
            transform: translate(-50%, 0);
            width: 30px;
            height: 40px;
          "/>
        </div>`,
      iconSize: [30, 70],
    });
  };

  // Use effect to fetch data when month/year changes
  useEffect(() => {
    fetchLatestData(); // Fetch the latest month and year
  }, []);

  // Fetch top 10 data whenever month or year changes
  useEffect(() => {
    fetchTop10Data();
  }, [latestMonth, latestYear]);

  return (
    <div style={{ display: 'flex', justifyContent: 'right', padding: '20px' }}>
      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Loading data...</div>} {/* Loading state */}

      <MapContainer
        center={[imageHeight / 2.3, imageWidth / 1.5]}
        zoom={0}
        minZoom={-1}
        scrollWheelZoom
        style={{
          height: '550px', // Use a fixed height for MapContainer
          width: '100%',
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
                {/* Check if the data for the marker is available before showing it */}
                {top10Data.find((college) => college.id === marker.id) ? (
                  <>
                    <p><strong>Total Waste Generated:</strong> {top10Data.find((college) => college.id === marker.id)?.totalKg} kg</p>
                    <p><strong>Month:</strong> {latestMonth}</p>
                    <p><strong>Year:</strong> {latestYear}</p>
                  </>
                ) : (
                  <p>No data available</p> // Only display "No data" if data is absent
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
