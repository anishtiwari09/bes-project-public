import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { badgetemplage } from "./badge-templage.js";

export const generateBadgePdf = async (name, company, qrCodeUrl, urn) => {
  const html = badgetemplage(name, company, qrCodeUrl, urn);

  const isVercel = !!process.env.VERCEL;
console.log({isVercel})
  const browser = await puppeteer.launch({
    args: isVercel ? chromium.args : [],
    executablePath: isVercel
      ? await chromium.executablePath
      : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();
  return pdfBuffer;
};
