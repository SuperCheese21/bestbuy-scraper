import {
  addToCartButton,
  checkoutButton,
  continueAsGuestButton,
} from './selectors.json';
import { clickOnElement, initBrowser, navigateToPage } from './utils';

(async () => {
  const skuId = 4758301;

  const page = await initBrowser({ width: 1000, height: 660 });

  await navigateToPage({
    page,
    url: `https://www.bestbuy.com/site/searchpage.jsp?st=${skuId}`,
  });

  await clickOnElement({
    page,
    selector: addToCartButton,
  });

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
