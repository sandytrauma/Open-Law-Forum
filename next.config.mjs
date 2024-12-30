/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,  // Disable Next.js image optimization
  },
  reactStrictMode: true,  // Enable React Strict Mode
 output: "export",

 async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://open-law-forum.netlify.app/:path*', // Replace with the actual API URL
    },
  ];
},
};

export default nextConfig;

