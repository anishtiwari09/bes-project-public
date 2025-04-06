import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium"; // handles Vercel-compatible Chromium
import { badgetemplage } from "./badge-templage.js";

export const generateBadgePdf = async (name, company, qrCodeUrl, urn) => {
  //test
  const isVercel = !!process.env.AWS_REGION; // Vercel sets AWS_REGION in serverless environment

  const executablePath = isVercel
    ? await chromium.executablePath
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; // Local Chrome path (Mac)

  const browser = await puppeteer.launch({
    args: isVercel ? chromium.args : [],
    executablePath,
    headless: chromium.headless, // chromium.headless works well for both
  });

  const page = await browser.newPage();
  const html = badgetemplage(name, company, qrCodeUrl, urn);
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();
  return pdfBuffer;
};
