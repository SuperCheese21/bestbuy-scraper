import puppeteer from 'puppeteer';

(async () => {
  const query = 'microphone';
  const url = `https://www.bestbuy.com/site/searchpage.jsp?st=${query}&_dyncharset=UTF-8&_dynSessConf=&id=pcat17071&type=page&sc=Global&cp=1&nrp=&sp=&qp=&list=n&af=true&iht=y&usc=All+Categories&ks=960&keys=keys`;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1000, height: 660 });

  await page.goto(url, { waitUntil: 'domcontentloaded' });
})();
