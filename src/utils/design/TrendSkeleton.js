import React from "react";

function TrendSkeleton() {
  return (
    <>
    {Array(10)
      .fill()
      .map((item, index) => (
        <div key={index} className="top-coins rounded-lg p-7 w-48 bg-white  relative animate-pulse">
        <span className="absolute left-0 top-0 bg-yellow-500 text-white  rounded text-sm px-2"></span>
        <div className="flex items-center">
          <svg
            className="w-12 h-12 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
          <div>
            <h1 className="flex flex-col ml-2 sm:text-sm md:text-base lg:text-lg xl:text-lg text-sm">
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-24 mb-2.5"></div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-12 mb-2.5"></div>
            </h1>
            <span className="uppercase text-xs text-gray-500"></span>
          </div>
        </div>
        <br />
        <br />
        <br />
       
        <div className="flex ">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-400 w-24 mb-2.5"></div>
          <div className="h-2.5 ml-2 bg-gray-300 rounded-full dark:bg-gray-400 w-12 mb-2.5"></div>
        </div>

        <div className=" flex justify-center sm:m-6 md:m-8 lg:m-10 xl:m-10 m-10 mb-6">
          <svg
            className="w-16 h-16 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>
      </div>
      ))}
    </>
  );
}

export default TrendSkeleton;
