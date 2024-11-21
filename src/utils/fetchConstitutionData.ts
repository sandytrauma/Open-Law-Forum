// src/utils/fetchConstitutionData.ts

import fs from 'fs';
import path from 'path';
import { ActSections } from '@/constants/types';

export const fetchConstitutionData = async (dir: string, fileName: string): Promise<ActSections> => {
  try {
    // Construct the file path
    const filePath = path.join(process.cwd(), 'src/constants/data', dir, fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read and parse the JSON file
    const jsonData = await fs.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(jsonData) as ActSections;

    // Validate data structure
    data.forEach(section => {
      if (typeof section.article !== 'number' && typeof section.article !== 'string') {
        throw new Error('Invalid data format: article must be a number or string');
      }
      // Additional validation if necessary
      if (typeof section.title !== 'string' && section.title !== undefined) {
        throw new Error('Invalid data format: title must be a string');
      }
      if (typeof section.description !== 'string' && section.description !== undefined) {
        throw new Error('Invalid data format: description must be a string');
      }
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading or parsing file ${fileName}: ${error.message}`);
    } else {
      console.error(`Unexpected error reading or parsing file ${fileName}:`, error);
    }
    
    // Consider returning an empty array or rethrowing the error based on your use case
    return []; // or throw new Error('Failed to fetch constitution data');
  }
};
