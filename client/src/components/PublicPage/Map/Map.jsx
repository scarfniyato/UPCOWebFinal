import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapBackground from '../../../assets/CvSUMapCropped.png';
import locationPin from '../../../assets/locationPin.png';
import locationPin1 from '../../../assets/locationPin1.png';
import * as d3 from 'd3';

const Map = () => {
  const [top10Data, setTop10Data] = useState([]);
  const [latestMonth, setLatestMonth] = useState('');
  const [latestYear, setLatestYear] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const imageWidth = 1200;
  const imageHeight = 800;
  const bounds = [[0, 0], [imageHeight, imageWidth]];

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

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/latest-waste-data');
        if (!response.ok) throw new Error('Failed to fetch latest data.');
        const { month, year } = await response.json();
        setLatestMonth(month);
        setLatestYear(year);
      } catch (error) {
        setError('Failed to load latest data. Please try again later.');
      }
    };
    fetchLatestData();
  }, []);

  useEffect(() => {
    if (!latestMonth || !latestYear) return;
    const fetchTop10Data = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/top10-waste-generators?month=${latestMonth}&year=${latestYear}`);
        if (!response.ok) throw new Error('Failed to fetch top 10 data.');
        const data = await response.json();
        setTop10Data(data);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };
    fetchTop10Data();
  }, [latestMonth, latestYear]);

  const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain([0, Math.max(...top10Data.map((d) => d.totalKg || 1))]);

  const getCustomMarker = (id) => {
    const dataEntry = top10Data.find((college) => college.id === id);
    if (!dataEntry) return { markerWithShadow: null, markerWithoutShadow: null };

    const color = colorScale(dataEntry.totalKg);
    const shadowColor = color;
    const shadowStyle = `0 0 30px 15px ${shadowColor}, 0 0 50px 20px ${shadowColor}, 0 0 70px 30px ${shadowColor}, 0 0 90px 40px ${shadowColor}, 0 0 120px 50px ${shadowColor}`;

    const markerWithShadow = L.divIcon({
      className: 'custom-marker-with-shadow',
      html: `<div style="position: relative; width: 50px; height: 70px;">
        <div class="marker" style="background-color: ${color}; border: 1px solid ${color}; box-shadow: ${shadowStyle}; position: absolute; top: 40%; left: 15%; opacity: 0.7;"></div>
      </div>
      <img src="${locationPin}" alt="Location Pin" style="position: absolute; top: -5%; left: 50%; transform: translate(-50%, 0); width: 30px; height: 40px;"/>`,
      iconSize: [30, 70],
    });

    const markerWithoutShadow = L.divIcon({
      className: 'custom-marker-without-shadow',
      html: `<div style="position: relative; width: 50px; height: 70px;">
        <div class="marker" style="background-color: ${color}; border: 1.5px solid rgb(19, 19, 19); position: absolute; top: 40%; left: 10%; width: 20px; height: 10px; border-radius: 50%; outline: black;"></div>
      </div>
      <img src="${locationPin1}" alt="Location Pin" style="position: absolute; top: -5%; left: 50%; transform: translate(-50%, 0); width: 30px; height: 40px;"/>`,
      iconSize: [30, 70],
    });

    return { markerWithShadow, markerWithoutShadow };
  };

  return (
    <MapContainer center={[imageHeight / 2.3, imageWidth / 1.5]} zoom={0} minZoom={-1} scrollWheelZoom style={{ height: '550px', width: '100%' }} crs={L.CRS.Simple} maxBounds={bounds} maxBoundsViscosity={1.0}>
      <ImageOverlay url={mapBackground} bounds={bounds} />
      {markerData.map((marker) => {
        const { markerWithShadow, markerWithoutShadow } = getCustomMarker(marker.id);
        return (
          <React.Fragment key={marker.id}>
            {markerWithShadow && <Marker position={[marker.lat, marker.lng]} icon={markerWithShadow} zIndexOffset={-10} />}
            {markerWithoutShadow && (
              <Marker position={[marker.lat, marker.lng]} icon={markerWithoutShadow} zIndexOffset={100}>
                <Popup>
                  <h3>{marker.name}</h3>
                  <p><strong>Total Waste Generated:</strong> {top10Data.find((college) => college.id === marker.id)?.totalKg || 'No data'} kg</p>
                </Popup>
              </Marker>
            )}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default Map;
