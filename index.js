import puppeteer, { launch } from 'puppeteer';
import * as fs from 'fs';
import { getData } from './get_data.js';

const METRICS_URL_LOCAL =
  'file:///Users/personal/Downloads/Google%20Cloud%20metrics%20%C2%A0_%C2%A0%20Cloud%20Monitoring.html';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
});

const page = await browser.newPage();

await page.goto(METRICS_URL_LOCAL, { waitUntil: 'networkidle0' });

const data = await page.evaluate(getData);

await browser.close();

await fs.promises.writeFile('metrics.json', JSON.stringify(data));
