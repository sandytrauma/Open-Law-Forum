/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, 
  }, 

    // If using Netlify, ensure this setting aligns with its plugin's requirements.
    distDir: '.next', // Default; should not be changed unless necessary.

};

export default nextConfig;

