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
        className="relative flex flex-col md:flex-row items-center justify-between h-screen bg-cover bg-center text-white px-40"
        style={{
          backgroundImage: `url(${cvsuBg}), linear-gradient(rgba(0, 58, 85, 0.3), rgba(0, 58, 85, 0.3))`
        }}
      >
        {/* Left Side Content */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-4xl font-extrabold leading-tight text-outline drop-shadow-dark">
            Discover<br />
            State of the Environment at <br />
            Cavite State University <br />
            Indang Campus
          </h1>
          <p className="mt-10 text-lg font-medium text-outline drop-shadow-light">
            Stay informed and help create a cleaner, <br /> greener future for our campus community.
          </p>
          <p className="mt-10 mb-10 text-lg font-semibold text-outline drop-shadow-light">
            Para sa Kalikasan, Para sa Kinabukasan!
          </p>
          <CustomButton onPress={handleScroll}>Learn More</CustomButton>
        </div>

        {/* Right Side Logo */}
        <div className="md:w-1/2 flex justify-end">
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
