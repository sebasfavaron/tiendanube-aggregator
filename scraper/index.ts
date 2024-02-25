import { readFileSync } from 'fs';
import { scrapeByUrl } from './scraping-utils';

if (process.argv[2] === '--multi') {
  const urls = readFileSync(process.argv[3]);
  urls
    .toString()
    .split('\n')
    .forEach((url) => {
      if (url) {
        scrapeByUrl(url);
      }
    });
} else if (process.argv[2] === '--single') {
  const url = process.argv[3];
  scrapeByUrl(url);
}
