/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,  // Disable Next.js image optimization
  },
  reactStrictMode: true,  // Enable React Strict Mode
  // Remove 'output: "export"' if using server-side rendering or serverless functions
};

export default nextConfig;

