
import React, { useEffect, useState } from "react";

const Overlay = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  // Optional: You can add a timeout to hide the overlay after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 5000); // Hide after 5 seconds (optional)
    return () => clearTimeout(timer);
  }, []);

  if (!showOverlay) return null; // Don't render anything if not showing

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-black bg-opacity-80 p-10 rounded-lg text-center text-white max-w-lg">
        <h2 className="text-3xl font-semibold mb-4">Page Not Available</h2>
        <p className="text-xl">
          This page is not available for users currently. Please try again later.
        </p>
      </div>
    </div>
  );
};

export default Overlay;
