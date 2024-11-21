// scripts/generateActList.js
const fs = require('fs');
const path = require('path');

// Directory where JSON files are located
const dataDir = path.join(__dirname, 'public/data/annotatedcentralacts_data');
// Output path for the generated actList.json
const outputFile = path.join(__dirname, '../public/actList.json');

// Function to get the names of all JSON files in the data directory
const getFileNames = () => {
  try {
    return fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
};

// Function to generate actList.json
const generateActList = () => {
  try {
    const fileNames = getFileNames();
    console.log(`Files found: ${fileNames.join(', ')}`);

    const fileList = fileNames.map(fileName => ({
      filePath: `/data/annotatedcentralacts_data/${fileName}`
    }));

    fs.writeFileSync(outputFile, JSON.stringify(fileList, null, 2));
    console.log('actList.json has been generated.');
  } catch (error) {
    console.error('Error generating actList.json:', error);
  }
};

// Run the function to generate actList.json
generateActList();
