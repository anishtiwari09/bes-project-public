import puppeteer from "puppeteer";
import { badgetemplage } from "./badge-templage";

export const generateBadgePdf = async (name, company, qrCodeUrl, urn) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(badgetemplage(name, company, qrCodeUrl, urn), {
    waitUntil: "networkidle0",
  });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdfBuffer;
};
