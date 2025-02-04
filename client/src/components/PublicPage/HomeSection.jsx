// src/components/HomeSection.jsx
import React from 'react';
import CustomButton from "../CustomButton.jsx";
import cvsuBg from '../../../src/assets/cvsu_bg.png';
import UPCO_logo from '../../../src/assets/UPCO_logo.png';

const HomeSection = ({ handleScroll }) => {
  return (
    <div>
      <section
        id="home"
        className="relative flex flex-col md:flex-row items-center justify-between h-screen bg-cover bg-center text-white px-36"
        style={{
          backgroundImage: `url(${cvsuBg}), linear-gradient(rgba(0, 58, 85, 0.3), rgba(0, 58, 85, 0.3))`
        }}
      >
        {/* Left Side Content */}
        <div className="md:w-3/4 text-left">
          <h1 className="text-[43px] font-bold leading-snug text-outline-light drop-shadow-light -mb-5 mt-5">
            Discover <br />State of the Environment <br />
            at Cavite State University <br />
            Indang Campus
          </h1>
          <p className="mt-8 mb-7 text-base font-semibold text-outline-light drop-shadow-md">
            Para sa Kalikasan, Para sa Kinabukasan!
          </p>
          <p className="mb-3 text-base font-medium text-outline-light drop-shadow-md ">
            Stay informed and help create a cleaner, <br /> greener future for our campus community.
          </p>
          
          <CustomButton onPress={handleScroll} className='drop-shadow-md '>Learn More</CustomButton>
        </div>

        {/* Right Side Logo */}
        <div className="md:w-1/2 flex justify-end -mr-10">
          <img
            src={UPCO_logo}
            alt="University Logo"
            className="max-w-full h-auto max-h-[460px] md:block hidden"
          />
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
