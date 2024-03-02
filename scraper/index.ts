import { readFileSync } from 'fs';
import { scrapeByUrl } from './scraping-utils';

console.log('Scraping', process.argv, process.argv[2]);
if (process.argv[2] === 'multi') {
  const urls = readFileSync(process.argv[3]);
  urls
    .toString()
    .split('\n')
    .forEach((url) => {
      if (url) {
        scrapeByUrl(url);
      }
    });
} else if (process.argv[2] === 'single') {
  const url = process.argv[3];
  scrapeByUrl(url);
} else {
  console.log(
    'Invalid arguments, choose --multi <txt-file> or --single <url-ex.https://ecommerce.com.ar>.'
  );
  process.exit(1);
}
