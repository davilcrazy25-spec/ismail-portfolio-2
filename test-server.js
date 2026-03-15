// Simple test script to verify server starts correctly
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'GET',
    timeout: 2000
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            console.log('✅ Server is working! Data received:', Object.keys(jsonData));
            console.log('✅ Portfolio items:', jsonData.portfolio?.length || 0);
            console.log('✅ Services:', jsonData.services?.length || 0);
            console.log('✅ Testimonials:', jsonData.testimonials?.length || 0);
        } catch (error) {
            console.error('❌ Error parsing JSON:', error.message);
        }
        process.exit(0);
    });
});

req.on('error', (err) => {
    console.error('❌ Server test failed:', err.message);
    console.log('Please make sure the server is running with: npm start');
    process.exit(1);
});

req.on('timeout', () => {
    console.error('❌ Server test timed out');
    req.destroy();
    process.exit(1);
});

req.end();
