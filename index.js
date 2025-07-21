const axios = require('axios'); // Install via: npm install axios
const { performance } = require('perf_hooks');

const url = 'http://127.0.0.1:5174/api/generate-pdf/Test';
const data = {
  orderNumber: "11213",
  customerName: "Dominos"
};

const headers = {
  'Content-Type': 'application/json'
};

async function sendRequest(index) {
  const start = performance.now();
  try {
    await axios.post(url, data, { headers });
    const end = performance.now();
    console.log(`Request ${index}: ${(end - start).toFixed(2)} ms`);
  } catch (error) {
    const end = performance.now();
    console.error(`Request ${index} failed: ${(end - start).toFixed(2)} ms - ${error.message}`);
  }
}

async function main() {
  const promises = [];
  for (let i = 1; i <= 30; i++) {
    promises.push(sendRequest(i));
  }
  await Promise.all(promises);
}

main();
