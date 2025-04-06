import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import { badgetemplage } from './badge-templage.js'; // make sure this is server-only too

export const generateBadgePdf = async (name, company, qrCodeUrl, urn) => {
  const executablePath = await chromium.executablePath || '/usr/bin/google-chrome';

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setContent(badgetemplage(name, company, qrCodeUrl, urn), {
    waitUntil: 'networkidle0',
  });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdfBuffer;
};
