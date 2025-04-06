import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { badgetemplage } from "./badge-templage";

export const generateBadgePdf = async (name, company, qrCodeUrl, urn) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setContent(badgetemplage(name, company, qrCodeUrl, urn), {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};
