

import React from 'react';
import { fetchConstitutionData } from '@/utils/fetchConstitutionData';
import { ActSections } from '@/constants/types';
import ConstitutionContent from '@/components/ConstitutionContent'; // Ensure this path is correct
import Image from 'next/image';

// Define a server component to fetch and render data
const ConstitutionArticlesPage = async () => {
  let data: ActSections = [];

  try {
    // Fetch data with the correct directory and filename
    data = await fetchConstitutionData('constitution_data', 'constitution_of_india.json');
  } catch (error) {
    console.error('Failed to fetch constitution articles:', error);
    data = []; // Default to an empty array if there is an error
  }

  return (
    <div className="p-4">
      <div className="items-center justify-center">
      <Image
      src="/reshot-icon-constitutional-law-Q6FLU2XMRJ.svg"   
      height={48}
      width={48}
      alt='Constitution-img'
      priority   
      className="mx-auto"
      />
      </div>
      <h1 className="text-center mt-5 text-teal-800 text-2xl md:text-3xl font-mono font-extrabold">Articles of Constitution</h1>
      <ConstitutionContent data={data} />
    </div>
  );
};

export default ConstitutionArticlesPage;
