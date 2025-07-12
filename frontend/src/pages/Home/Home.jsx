import React from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row items-center md:justify-between w-full bg-gradient-to-r from-white to-red-400 p-8 md:p-16">
        <div className="col-2 md:w-1/2 md:order-2 home-hero mb-8 md:mb-0">
          <img src={"/images/image1.png"} alt="My Image" />
        </div>
        <div className="md:w-1/2 md:order-1 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Give Your Workout
            <br />A New Style!
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6">
            Success isn't always about greatness. It's about consistency.
            Consistency hard work gains success. Greatness will come.
          </p>
          <NavLink
            className="inline-block bg-red-500 text-white py-2 px-6 rounded-full transition duration-300 hover:bg-red-600"
          >
            Explore <i className="fas fa-arrow-right"></i>
          </NavLink>
        </div>
      </div>

      {/* Categories */}
      <div className="py-20">
        <div className="w-full md:w-4/5 lg:w-2/3 mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="mb-8">
              <img src={"/images/category-1.jpg"} className="w-full" alt="" />
            </div>
            <div className="mb-8">
              <img src={"/images/category-2.jpg"} className="w-full" alt="" />
            </div>
            <div className="mb-8">
              <img src={"/images/category-3.jpg"} className="w-full" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
