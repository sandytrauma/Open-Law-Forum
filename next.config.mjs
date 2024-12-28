/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,  // Disable Next.js image optimization
  },
  reactStrictMode: true,  // Enable React Strict Mode
 output: "export",
};

export default nextConfig;

