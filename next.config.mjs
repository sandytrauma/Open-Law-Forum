/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, 
  }, 

 
    output: 'export',

    experimental: {
      appDir: true, // Enable the App Router
    },

};

export default nextConfig;

