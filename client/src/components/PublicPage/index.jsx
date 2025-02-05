import React, { useState, useEffect } from "react";
import Navbar from "./navBar.jsx";
import './indexStyle.css';
import Map from "./Map/Map.jsx";
import Top10TableList from "./Map/top10TableList.jsx";
import PublicEnviPolicies from './publicEnviPolicies.jsx';
import { scroller } from 'react-scroll';
import HomeSection from './HomeSection';
import ContactSection from './ContactSection';
import SOE from './SOE.jsx';


// Importing images dynamically
import landingPage_bg from '../../../src/assets/landingPage_bg.png';

function PublicPage() {
  const [latestMonth, setLatestMonth] = useState('');
  const [latestYear, setLatestYear] = useState('');
  const [error, setError] = useState(null);

  // Fetch the latest month and year
  const fetchLatestData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/latest-waste-data');
      if (!response.ok) throw new Error('Failed to fetch latest data.');

      const { month, year } = await response.json();

      // Ensure the latest month and year are set
      setLatestMonth(month);
      setLatestYear(year);
    } catch (error) {
      console.error('Error fetching latest data:', error);
      setError('Failed to load latest data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  const handleScroll = () => {
    scroller.scrollTo('state-of-environment', {
      duration: 1500,
      delay: 0,
      smooth: 'easeInOutQuad',
      offset: -70, // Adjusts for fixed navbar height
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${landingPage_bg})` }}
    >
      <Navbar />
      <HomeSection handleScroll={handleScroll} />

      {/* Error Display */}
      {error && <div className="error">{error}</div>}

      <div id="state-of-environment" className='text-center fbold border-bottom w-5/6 mx-auto mt-16'>
        <h5 className="text-sm mt-3">Cavite State University - Indang Campus</h5>
        <p1 className='text-3xl mt-5'>State of the Environment</p1>
        <hr className="border-2 border-dark w-5/6 mx-auto mt-2" />

        <SOE />

        {/* Other Sections */}
        <div className="flex justify-center items-center mt-18">
          <div className="bg-white rounded-lg shadow-lg p-4 w-4/6 max-h-[600px] h-[550px] overflow-hidden">
            <h4 className="text-fcolor text-base font-bold">CvSU Main Campus - Map</h4>
            <p className="text-gray-700 text-sm font-semibold my-2">
              {latestMonth || 'Loading...'} {latestYear || 'Loading...'}
            </p>
            <div className="w-full h-[445px] overflow-hidden">
              <Map />
            </div>
          </div>
        </div>


        <div className="flex justify-center items-center mt-18">
          <div className="bg-white rounded-lg shadow-lg p-5 w-4/6">
            <h4 className="text-fcolor text-base font-bold">Top 10 Solid Waste Generators</h4>
            <Top10TableList />
          </div>
        </div>
      </div>

      <div id="policies" className='text-center fbold border-bottom w-5/6 mx-auto mt-24'>
        <h5 className="text-sm mt-3">Cavite State University - Indang Campus</h5>
        <p1 className='text-3xl mt-5'>UPCO Environmental Policies</p1>
        <hr className="border-2 border-dark w-5/6 mx-auto mt-2" />
        <PublicEnviPolicies /> 
      </div>

      <ContactSection />
    </div>
  );
}

export default PublicPage;
