import puppeteer from 'puppeteer';

export const clickOnElement = async ({ page, selector, waitForNavigation }) => {
  await page.waitForSelector(selector);
  await (waitForNavigation
    ? Promise.all([page.waitForNavigation(), page.click(selector)])
    : page.click(selector));
};

export const initBrowser = async ({ width, height }) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width, height });
  return page;
};

export const navigateToPage = ({ page, url }) =>
  page.goto(url, { waitUntil: 'domcontentloaded' });
