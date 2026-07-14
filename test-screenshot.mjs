import puppeteer from 'puppeteer';
import fs from 'fs';
async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto('http://localhost:5173/projects', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot_projects.png', fullPage: true });

  await page.goto('http://localhost:5173/news', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot_news.png', fullPage: true });
  
  await browser.close();
  console.log('Screenshots saved.');
}
run();
