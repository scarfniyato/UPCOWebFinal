import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import mapBackground from '../../../assets/CvSUMapCropped.png';
import * as d3 from 'd3';

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    // Define the exact gradient without any green shades
    const heatmapGradient = {
      0.2: "#FFF2CC", // Light Yellow
      0.4: "#FFD966", // Yellow
      0.6: "#F4B183", // Orange
      0.8: "#E06666", // Red
      1.0: "#800000"  // Dark Red
    };

    // Ensure intensity values are strong for visibility
    const heatPoints = points.map(([lat, lng, totalKg]) => {
      return [lat, lng, 2.0]; // Doubled intensity to remove fading
    });

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 150,  // Larger to enhance the strong colors
      blur: 20,    // Reduced blur to prevent green mix
      maxZoom: 19,
      gradient: heatmapGradient
    }).addTo(map);

    return () => {
      if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);

  return null;
};

const Map = () => {
  const [top10Data, setTop10Data] = useState([]);
  const [latestMonth, setLatestMonth] = useState(null);
  const [latestYear, setLatestYear] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const imageWidth = 1200;
  const imageHeight = 800;

  const bounds = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

  const markerData = [
    { name: 'College A', lat: 260, lng: 875 },
    { name: 'College B', lat: 410, lng: 900 },
    { name: 'College C', lat: 365, lng: 838 },
    { name: 'College D', lat: 335, lng: 640 },
    { name: 'College E', lat: 410, lng: 1035 },
    { name: 'College F', lat: 205, lng: 980 },
    { name: 'College G', lat: 315, lng: 840 },
    { name: 'College H', lat: 457, lng: 890 },
    { name: 'College I', lat: 338, lng: 890 },
    { name: 'College J', lat: 242, lng: 915 },
  ];

  const fetchLatestDate = async () => {
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

  const fetchTop10Data = async () => {
    if (!latestMonth || !latestYear) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/top10-waste-generators?month=${latestMonth}&year=${latestYear}`
      );
      if (response.ok) {
        const top10Data = await response.json();
        setTop10Data(top10Data);
      } else {
        setTop10Data([]);
      }
    } catch (error) {
      console.error('Error fetching top 10 data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestDate();
  }, []);

  useEffect(() => {
    if (latestMonth && latestYear) {
      fetchTop10Data();
    }
  }, [latestMonth, latestYear]);

  // Map top10Data to heatmap-compatible points
  const heatmapPoints = top10Data
    .map(college => {
      const marker = markerData.find(m => m.name === college.name);
      return marker ? [marker.lat, marker.lng, college.totalKg] : null;
    })
    .filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      {error && <div className="error-message">{error}</div>}
      <MapContainer
        center={[imageHeight / 2.3, imageWidth / 1.5]}
        zoom={0}
        minZoom={-1}
        scrollWheelZoom
        style={{ height: '550px', width: '1000px' }}
        crs={L.CRS.Simple}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        <ImageOverlay url={mapBackground} bounds={bounds} />
        <HeatmapLayer points={heatmapPoints} />
      </MapContainer>
    </div>
  );
};

export default Map;
