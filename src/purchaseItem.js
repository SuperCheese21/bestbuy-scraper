import axios from 'axios';

(async () => {
  const res = await axios.get('https://www.bestbuy.com/');
  console.log({ res });
})();
