import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { badgetemplage } from "./badge-templage.js";

export const generateBadgePdf = async (name:string, company:string, qrCodeUrl:string, urn:string) => {
  const html = badgetemplage(name, company, qrCodeUrl, urn);

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.NODE_ENV === "development"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" // Local
      : await chromium.executablePath(), // Vercel
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdfBuffer;
};
