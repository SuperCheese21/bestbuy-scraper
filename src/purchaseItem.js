import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import {
  changeShippingZip,
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
  placeOrderButton,
} from '../data/selectors.json';
import {
  shippingAddress,
  contactInfo,
  paymentInfo,
  billingAddress,
} from '../data/user_info.json';

(async () => {
  const { argv } = yargs(hideBin(process.argv));
  const { _, test: testMode } = argv;
  const skuId = _[0];

  const page = await initBrowser({ width: 1000, height: 660 });

  await navigateToPage({
    page,
    url: `https://www.bestbuy.com/site/searchpage.jsp?st=${skuId}`,
  });

  await clickOnElement({
    page,
    selector: addToCartButton,
    waitForNavigation: true,
  });

  await changeShippingZip({ page, zip: shippingAddress.zip });

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

  if (!testMode) {
    await clickOnElement({
      page,
      selector: placeOrderButton,
      waitForNavigation: true,
    });
  }
})();
