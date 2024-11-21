import fs from 'fs';
import path from 'path';
import { ActSections } from '@/constants/types'; // Adjust the path if necessary

export const fetchActSections = async (fileName: string): Promise<ActSections> => {
  try {
    const filePath = path.join(process.cwd(), `src/constants/data/${fileName}`);
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading or parsing file ${fileName}:`, error);
    throw new Error('Failed to fetch act sections');
  }
};

