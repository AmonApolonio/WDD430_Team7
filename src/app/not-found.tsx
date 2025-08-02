import React from "react";

// Custom 404 page
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg">Page Not Found</p>
    </div>
  );
}
