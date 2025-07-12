import React from "react";

function Footer() {
  return (
    <div className="bg-black text-gray-400 py-10 px-6">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-3">
          <div className="flex flex-col items-center text-center space-y-4">
            <h3 className="text-white text-lg font-semibold">Download Our App</h3>
            <p>Download App for Android and iOS Mobile Phone</p>
            <div className="mt-4 flex justify-center space-x-2">
              <img src={'/images/play-store.png'} alt="Play-store" className="w-12" />
              <img src={'/images/app-store.png'} alt="App Store" className="w-12" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <img src={'/images/logo-white.png'} alt="Logo" className="w-24 mb-4" />
            <p>
              Our Purpose Is To Sustainably Make the Pleasure and Benefits of Sports Accessible to the Many.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <h3 className="text-white text-lg font-semibold">Useful Links</h3>
            <ul className="space-y-2">
              <li>Coupons</li>
              <li>Blog Post</li>
              <li>Return Policy</li>
              <li>Join Affiliate</li>
            </ul>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <h3 className="text-white text-lg font-semibold">Connect At</h3>
            <ul className="space-y-2">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
        <hr className="bg-gray-300 my-8" />
        <p className="text-center text-sm">Copyright {new Date().getFullYear()} - Ecommerce Website</p>
      </div>
    </div>
  );
}

export default React.memo(Footer);
