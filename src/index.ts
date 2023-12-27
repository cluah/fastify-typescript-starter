import fastify from 'fastify';
import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const server = fastify();

let browser: Browser | null = null;

server.get('/', async (_request, _reply) => {
  if (!browser) return 'browser not ready';

  const page = await browser.newPage();
  await page.goto('https://www.diariooficial.interior.gob.cl/');

  try {
    await page.waitForSelector('#tramites', { timeout: 3000 });
    const content = await page.content();
    return content;
  } catch (err) {
    return ':(';
  }
});

server.listen({ port: 8080 }, async (err, address) => {
  browser = await puppeteer.use(StealthPlugin()).launch({ headless: 'new' });

  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
