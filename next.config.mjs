/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,  // Disable Next.js image optimization
  },
  reactStrictMode: true,
  output: 'export',  // If you are exporting the app as static pages
  experimental: {
    appDir: true,  // Enable the app directory (required for Next.js 13+)
  },
 // Enable React Strict Mode

  output: 'export',
 
};

export default nextConfig;

