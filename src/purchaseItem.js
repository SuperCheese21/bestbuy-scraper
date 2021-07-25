import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import {
  clickOnElement,
  initBrowser,
  navigateToPage,
  populateAddressForm,
  populateContactInfoForm,
  populateCreditCardForm,
} from './utils';
import {
  addToCartButton,
  checkoutButton,
  continueAsGuestButton,
  shippingAddress as shippingAddressSelectors,
  saveAsBillingCheckbox,
  continueButton,
  billingAddress as billingAddressSelectors,
} from '../data/selectors.json';
import {
  shippingAddress,
  contactInfo,
  paymentInfo,
  billingAddress,
} from '../data/user_info.json';

(async () => {
  const { argv } = yargs(hideBin(process.argv));
  const skuId = argv._[0];

  const page = await initBrowser({ width: 1000, height: 660 });

  await navigateToPage({
    page,
    url: `https://www.bestbuy.com/site/searchpage.jsp?st=${skuId}`,
  });

  await clickOnElement({
    page,
    selector: addToCartButton,
  });
  const res = await page.waitForResponse(
    'https://www.bestbuy.com/cart/api/v1/addToCart',
  );
  const status = await res.status();
  if (status !== 200) {
    console.log(`Unable to add item to cart. Status: ${status}`);
    return;
  }

  await navigateToPage({ page, url: 'https://www.bestbuy.com/cart' });

  await clickOnElement({
    page,
    selector: checkoutButton,
    waitForNavigation: true,
  });

  await clickOnElement({
    page,
    selector: continueAsGuestButton,
    waitForNavigation: true,
  });

  await populateAddressForm({
    page,
    selectors: shippingAddressSelectors,
    data: shippingAddress,
  });

  if (billingAddress) {
    await clickOnElement({
      page,
      selector: saveAsBillingCheckbox,
    });
  }

  await populateContactInfoForm({ page, data: contactInfo });

  await clickOnElement({
    page,
    selector: continueButton,
    waitForNavigation: true,
  });

  await populateCreditCardForm({ page, data: paymentInfo });

  if (billingAddress) {
    await populateAddressForm({
      page,
      selectors: billingAddressSelectors,
      data: billingAddress,
    });
  }
})();
