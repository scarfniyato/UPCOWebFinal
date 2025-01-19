import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import mapBackground from '../../../assets/CvSUMapCropped.png';

const Map = () => {
  const [top10Data, setTop10Data] = useState([]);
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

  const colorCoding = ['#FF0000', '#FF4500', '#FFD700', '#ADFF2F', '#7FFF00', '#32CD32', '#228B22', '#006400', '#008080', '#2F4F4F'];

  const fetchTop10Data = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/top10-waste-generators?month=January&year=2026');
      if (!response.ok) throw new Error('Failed to fetch top 10 data.');
      const data = await response.json();
      setTop10Data(data);
    } catch (error) {
      console.error('Error fetching top 10 data:', error);
      setError('Failed to load data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchTop10Data();
  }, []);

  const getCustomMarker = (id) => {
    const index = top10Data.findIndex((college) => college.id === id);
    if (index === -1) return null;

    const color = colorCoding[index];
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="width: 10px; height: 10px; border-radius: 50%; background-color: yellow; border: 3px solid ${color}; box-shadow: 0 0 70px 30px ${color};"></div>`,
      iconSize: [50, 50],
    });
  };

  return (
    <div className="map-container">
      {error && <div className="error-message">{error}</div>}
      <MapContainer
        center={[imageHeight / 2, imageWidth / 2]}
        zoom={0}
        minZoom={-1}
        scrollWheelZoom
        style={{
          height: `${imageHeight}px`,
          width: `${imageWidth}px`,
          margin: '0 auto',
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
              icon={customMarker || L.icon({ iconUrl: '../../../assets/locationPin.png', iconSize: [30, 40] })}
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
                      <strong>Month:</strong> January
                    </p>
                    <p>
                      <strong>Year:</strong> 2026
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






















