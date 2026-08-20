import React from "react";

export default function Loading({ className = "" }) {
  return (
    <div className={`h-screen w-full p-3 sm:p-4 ${className}`.trim()}>
      <div className="relative h-full text-slate-900 dark:text-white p-4 overflow-y-auto transition-colors duration-300 flex justify-center items-center">
        <div className="flex items-center justify-center p-5">
          <div className="flex space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-gray-500 dark:bg-gray-100 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 dark:bg-gray-100 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 dark:bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
