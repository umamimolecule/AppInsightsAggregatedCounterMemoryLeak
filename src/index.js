const uuid = require('crypto').randomUUID;
const appInsights = require('applicationinsights');
const AutoCollectPreAggregatedMetrics = require('applicationinsights/out/AutoCollection/PreAggregatedMetrics');
const { TableClient } = require('@azure/data-tables');

require('dotenv').config()

appInsightsConnectionString = process.env.APPLICATION_INSIGHTS_CONNECTION_STRING;
appInsights.setup(appInsightsConnectionString).start();

const storageAccountConnectionString = process.env.STORAGE_ACCOUNT_CONNECTION_STRING;
const tableClient = TableClient.fromConnectionString(storageAccountConnectionString, "MyTable");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  await tableClient.createTable();
  while (true) {
    const pk = uuid();
    const rk = uuid();
    console.log(`Fetching entity PK=${pk}, RK=${rk}`);
    const startTime = Date.now();
    try {
      await tableClient.getEntity(pk, rk);
    } catch {
      // swallow 
    }
    
    const endTime = Date.now();
    console.log(`Took ${endTime - startTime} ms`);
    // console.log(JSON.stringify(AutoCollectPreAggregatedMetrics._dependencyCountersCollection, null, 2))
    console.log(`AutoCollectPreAggregatedMetrics._dependencyCountersCollection.length = ${AutoCollectPreAggregatedMetrics._dependencyCountersCollection.length}`);

    await sleep(1000);
  }
}

run();
