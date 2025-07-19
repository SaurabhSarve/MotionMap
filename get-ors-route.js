// get-ors-route.js
import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';

const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJkYmNmMDMwODQwYzQ2Zjk4ZDQ1MWMwYTQ5MzcxOGY0IiwiaCI6Im11cm11cjY0In0='; // replace with your ORS key

const start = [78.4747, 17.3616];    // Charminar
const end = [78.3762, 17.4474];      // Gachibowli

const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

const body = {
  coordinates: [start, end]
};

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': apiKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

const data = await response.json();

// Extract route coordinates
const coordinates = data.features[0].geometry.coordinates;

const route = coordinates.map((pair, index) => ({
  latitude: pair[1],
  longitude: pair[0],
  timestamp: `2025-07-19T10:${String(index).padStart(2, '0')}:00Z`
}));

await writeFile('public/dummy-route.json', JSON.stringify(route, null, 2));
console.log('✅ dummy-route.json created with ORS route!');
