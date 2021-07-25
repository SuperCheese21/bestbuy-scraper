import puppeteer from 'puppeteer';

(async () => {
  const query = 'microphone';

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1000, height: 660 });

  await page.goto('https://www.bestbuy.com/', {
    waitUntil: ['domcontentloaded', 'networkidle0'],
  });
  await page.click('.c-modal-close-icon');
  await page.type('#gh-search-input', query);
})();
