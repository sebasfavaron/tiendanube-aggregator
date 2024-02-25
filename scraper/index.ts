import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync, readFileSync } from 'fs';

type TiendanubeProductsResponse = {
  html: string;
  page: number;
  has_results: boolean;
  has_next: boolean;
  // prev: null,
  // next: null,
  // parent: Document {
  //   parent: null,
  //   prev: null,
  //   next: null,
  //   startIndex: null,
  //   endIndex: null,
  //   children: [ [Circular *1] ],
  //   type: 'root'
  // }
};
async function fetchHtml<T>(url: string): Promise<T | null> {
  try {
    const response = await axios.get(url);
    return response.data as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching HTML:', error.message);
    } else {
      console.error('Unknown error fetching HTML');
    }
    return null;
  }
}

async function main(url: string) {
  const limit = 100;
  let page = 1;
  let has_next = true;
  while (has_next) {
    has_next = await addProductByPage(url, page, limit);
    page++;
  }
}

async function addProductByPage(
  url: string,
  page: number,
  limit: number
): Promise<boolean> {
  console.log(`Fetching page ${page} with limit ${limit}...`);
  const { html, has_next } =
    (await fetchHtml<TiendanubeProductsResponse>(
      `${url}/productos/page/${page}/?results_only=true&limit=${limit}`
    )) ?? {};
  if (!html) {
    return false;
  }

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
    let productInfoText =
      $(el).find('script').text() || $(el).next().text() || '{}'; // Sometimes the script is not in the div, but in the next one
    productInfoText = productInfoText.replace(/\n/g, '').replace(/\t/g, '');
    const productInfo = JSON.parse(productInfoText);
    if (
      productInfo &&
      productInfo.offers &&
      productInfo.offers.price &&
      productInfo.offers.url &&
      productInfo.name &&
      productInfo.image &&
      productInfo.description
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

  let allProducts: Product[] = [];
  let existingProducts: Product[] = [];
  try {
    existingProducts = JSON.parse(readFileSync('allProducts.json', 'utf8'));
  } catch (error) {
    console.log('No existing products found, created new file');
  }
  allProducts = [...existingProducts, ...products];
  writeFileSync('allProducts.json', JSON.stringify(allProducts, null, 2));
  return has_next ?? false;
}

const url = process.argv[2];
main(url);
