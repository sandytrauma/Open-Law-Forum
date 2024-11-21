// src/app/api/files/route.js
import fs from 'fs';
import path from 'path';

export async function GET() {
    const directoryPath = path.join(process.cwd(), 'public', 'data', 'annotatedcentralacts_data');
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));

    return new Response(JSON.stringify(files), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
