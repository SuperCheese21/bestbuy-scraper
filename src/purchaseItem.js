import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { clickOnElement, initBrowser, navigateToPage } from './utils';
import {
  addToCartButton,
  checkoutButton,
  continueAsGuestButton,
} from '../data/selectors.json';

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
})();
