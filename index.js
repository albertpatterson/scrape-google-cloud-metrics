import puppeteer, { launch } from 'puppeteer';
import * as fs from 'fs';
import { getData } from './get_data.js';

const METRICS_URL_LOCAL = 'https://cloud.google.com/monitoring/api/metrics_gcp';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
});

const page = await browser.newPage();

await page.goto(METRICS_URL_LOCAL, { waitUntil: 'networkidle0' });

const data = await page.evaluate(getData);

await browser.close();

await fs.promises.writeFile('metrics.json', JSON.stringify(data));
