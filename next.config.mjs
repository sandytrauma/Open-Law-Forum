/** @type {import('next').NextConfig} */
const nextConfig = {

    typescript:{
    ignoreBuildErrors:true,
  },
  
  images: {
    unoptimized: true,  // Disable Next.js image optimization
  },
 

  output: 'export',
 
};

export default nextConfig;

