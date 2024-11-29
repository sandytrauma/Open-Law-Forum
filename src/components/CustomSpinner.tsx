import React from 'react';

const CustomSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner w-16 h-16 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default CustomSpinner;





