import React from 'react'

const Skeleton = () => {
    return (
      <div className="flex flex-col items-start w-full md:w-1/5 p-2 min-w-[200px] mb-12 transition-transform duration-500 hover:transform hover:-translate-x-1">
        <div className="w-full animate-pulse">
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4 my-1 animate-pulse"></div>
        <div className="flex my-1">
          <div className="w-4 h-4 bg-gray-200 rounded-full mr-1 animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full mr-1 animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full mr-1 animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full mr-1 animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full mr-1 animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 my-1 animate-pulse"></div>
      </div>
    );
  };
  

export default Skeleton
