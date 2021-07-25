import puppeteer from 'puppeteer';

import {
  changeZipButton,
  locationInput,
  updateLocationButton,
  addressResultItem,
  addressLineTwoButton,
  emailAddressInput,
  phoneNumberInput,
  cardNumberInput,
  expirationMonthSelect,
  expirationYearSelect,
  securityCodeInput,
} from '../data/selectors.json';

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

export const changeShippingZip = async ({ page, zip }) => {
  const button = await page.$(changeZipButton);
  const currentZip = await page.evaluate(
    element => element.innerHTML.trim(),
    button,
  );
  if (currentZip !== zip) {
    await clickOnElement({
      page,
      selector: changeZipButton,
    });
    await page.type(locationInput, zip);
    await clickOnElement({
      page,
      selector: updateLocationButton,
    });
    await page.waitForResponse(response =>
      response.url().includes('/api/tcfb/model.json'),
    );
    await page.waitForTimeout(500);
  }
};

export const populateAddressForm = async ({ page, selectors, data }) => {
  await page.type(selectors.firstNameInput, data.firstName);
  await page.type(selectors.lastNameInput, data.lastName);
  await page.type(
    selectors.addressLineOneInput,
    `${data.addressLineOne}, ${data.city}, ${data.state}`,
  );
  await page.waitForTimeout(500);
  await clickOnElement({
    page,
    selector: addressResultItem,
  });
  if (data.addressLineTwo) {
    await clickOnElement({ page, selector: addressLineTwoButton });
    await page.type(selectors.addressLineTwoInput, data.addressLineTwo);
  }
};

export const populateContactInfoForm = async ({ page, data }) => {
  await page.type(emailAddressInput, data.emailAddress);
  await page.type(phoneNumberInput, data.phoneNumber);
};

export const populateCreditCardForm = async ({ page, data }) => {
  await page.type(cardNumberInput, data.cardNumber);
  await page.select(expirationMonthSelect, data.expirationMonth);
  await page.select(expirationYearSelect, data.expirationYear);
  await page.type(securityCodeInput, data.securityCode);
};
