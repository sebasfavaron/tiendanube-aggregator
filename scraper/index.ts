import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync, readFileSync } from 'fs';

const url = process.argv[2];
async function fetchHtml(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching HTML:', error.message);
    } else {
      console.error('Unknown error fetching HTML');
    }
    return '';
  }
}

async function main(url: string) {
  const html = await fetchHtml(url);
  // const html = readFileSync(url, 'utf8');

  const $ = cheerio.load(html);
  const productsDiv = $('.js-item-product');

  type Product = {
    name: string;
    description: string;
    price: number;
    image: string;
    url: string;
  };
  const products: Product[] = [];
  productsDiv.each((i, el) => {
    const productInfo = JSON.parse($(el).find('script').text() || '{}');
    if (
      productInfo &&
      productInfo.offers &&
      productInfo.offers.price &&
      productInfo.name &&
      productInfo.image &&
      productInfo.description &&
      productInfo.offers.url
    ) {
      products.push({
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.offers.price,
        image: productInfo.image,
        url: productInfo.offers.url,
      });
    } else {
      console.log('Error parsing product info', productInfo);
    }
  });
  console.log(
    `Found ${products.length} products, from ${productsDiv.length} rows`
  );
  const safeUrl = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  writeFileSync(`${safeUrl}.json`, JSON.stringify(products, null, 2));
}

main(url);
