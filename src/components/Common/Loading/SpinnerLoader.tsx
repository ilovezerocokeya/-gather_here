"use client";

import React from "react";

const SpinnerLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="loader"></div>
    </div>
  );
};

export default SpinnerLoader;