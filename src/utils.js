import puppeteer from 'puppeteer';

export const initBrowser = async ({ width, height }) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width, height, isLandscape: true });
  await page.setExtraHTTPHeaders({
    dnt: '1',
  });
  return page;
};

export const navigateToPage = async ({ page, url }) => {
  try {
    await page.goto(url, {
      waitUntil: ['load', 'domcontentloaded'],
    });
    console.log(`Navigated to ${page.url()}`);
  } catch (err) {
    console.error(err);
  }
};

export const clickOnElement = async ({ page, selector, waitForNavigation }) => {
  try {
    await page.waitForSelector(selector);
    await (waitForNavigation
      ? Promise.all([page.waitForNavigation(), page.click(selector)])
      : page.click(selector));
    console.log(`Clicked on ${selector}`);
  } catch (err) {
    console.error(err);
  }
};
