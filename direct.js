const axios = require('axios');
const { performance } = require('perf_hooks');

const url = 'http://localhost:5488/api/report';
const data = {
    template: { name: "test-main" },
    data: {
      customerName: "Kingshuk",
      orderNumber: "11213"
    }
  }

const headers = {
  'Content-Type': 'application/json'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

async function sendBatch(startIndex, batchSize) {
  const promises = [];
  for (let i = 0; i < batchSize; i++) {
    promises.push(sendRequest(startIndex + i));
  }
  await Promise.all(promises);
}

async function main() {
  const totalRequests = 1000;
  const batchSize = 30;
  const delayBetweenBatchesMs = 30 * 1000;

  for (let batchStart = 0; batchStart < totalRequests; batchStart += batchSize) {
    await sendBatch(batchStart + 1, Math.min(batchSize, totalRequests - batchStart));
    if (batchStart + batchSize < totalRequests) {
      console.log(`Waiting 1 minute before next batch...`);
      await sleep(delayBetweenBatchesMs);
    }
  }

  console.log('All requests completed.');
}

main();
