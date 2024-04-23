const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const package = require('./package.json');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Check if the .env file exists
if (fs.existsSync('.env')) {
    // Function to generate environment content
    function generateEnvironmentContent() {
        return `export const environment = {
        appVersion: "${package.version}",
        production: ${process.env.production},
        apiUrl: "${process.env.apiUrl}",
        baseUrl: "${process.env.baseUrl}"
    };`;
    }

    // Generate the environment.ts file
    (function generateEnvironment() {
        const fileName = 'environment.ts';
        const content = generateEnvironmentContent();
        const outputPath = path.join(__dirname, 'src/environments', fileName);

        fs.writeFileSync(outputPath, content); // Write the environment content to the file
        console.log(`'environment.ts' file generated successfully.`);
    })();
} else {
    console.error('.env file not found. Please create a .env file with the required environment variables.');
}
