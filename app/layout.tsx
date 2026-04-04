import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./UIComponent/Navbar/Navbar";
import Footer from "./UIComponent/Footer/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ENVIROMENT } from "./backend/constant";
import type { ReactNode } from "react";
import ClientWrapper from "./UIComponent/cient-wrapper";
import DownloadBrochureButton from "./UIComponent/buttons/download-brochure";
import { getHomepageContent } from "./homepage/get-homepage-content";
import { getGlobalBrochureButton } from "./homepage/get-global-brochure-button";
import { headers } from "next/headers";

// ✅ Global Expo SEO Config
import {
  EXPO_NAME,
  EXPO_DESCRIPTION,
  EXPO_URL,
  EXPO_OG_IMAGE,
} from "./config/expo";
import NewRelicAnalytics from "./scripts/new-relic-analytics";

// ✅ GLOBAL SEO (applies to ALL pages — no modification needed anywhere)
export const metadata: Metadata = {
  title: {
    default: EXPO_NAME,
    template: `%s | ${EXPO_NAME}`,
  },
  description: EXPO_DESCRIPTION,

  keywords: [
    // English Keywords
    "BES Expo",
    "BES Expo 2025",
    "Broadcast Engineering Society Expo",
    "Broadcast Engineering Society",
    "Broadcast Technology",
    "Media Technology Expo",
    "OTT Technology",
    "AV Technology",
    "Broadcast India",
    "Broadcast Industry",
    "Pragati Maidan Expo",
    "Tech In Broadcast",
    "AV Expo India",
    "Satellite Technology",
    "IPTV India",
    "OTT India",
    "AI in Media",
    "Broadcast Conference India",
    "Media Tech Exhibition",
    "New Business Ideas",
    "Business Opportunities",
    "Broadcasting Technology",
    "TV Technology",
    "Film Technology",
    "Mobile Broadcasting",
    "Digital Media Expo",

    // Hindi Keywords
    "ब्रॉडकास्ट इंजीनियरिंग एक्सपो",
    "बीईएस एक्सपो",
    "बीईएस एक्सपो 2025",
    "प्रगति मैदान प्रदर्शनी",
    "मीडिया टेक्नोलॉजी",
    "इंडिया टेक एक्सपो",
    "ब्रॉडकास्ट इंडिया",
    "ब्रॉडकास्ट इंडिया 2025",
  ],

  alternates: {
    canonical: EXPO_URL,
  },

  openGraph: {
    title: EXPO_NAME,
    description: EXPO_DESCRIPTION,
    url: EXPO_URL,
    siteName: EXPO_NAME,
    images: [
      {
        url: EXPO_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: EXPO_NAME,
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: EXPO_NAME,
    description: EXPO_DESCRIPTION,
    images: [EXPO_OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const requestHeaders = await headers();
  const nextUrl = requestHeaders.get("next-url") || requestHeaders.get("x-pathname");
  let pathname = "";
  if (nextUrl) {
    try {
      pathname = new URL(nextUrl, "http://localhost").pathname;
    } catch {
      pathname = nextUrl.startsWith("/") ? nextUrl : "";
    }
  }
  const isHomePage = pathname === "/";

  const homepageContent = isHomePage ? await getHomepageContent() : null;
  const brochureButton = isHomePage
    ? homepageContent?.brochureButton
    : await getGlobalBrochureButton();

  return (
    <html lang="en" className="h-full">
      <head>{ENVIROMENT === "production" && <NewRelicAnalytics />}</head>
      <body className="h-full overflow-hidden">
        {/* <Suspense> */}
        <ClientWrapper>
          <Navbar />

          <div className="overflow-auto inner_page scroll-smooth">
            <div className="body_page">{children}</div>
            {!!brochureButton?.label && (
              <DownloadBrochureButton
                href={brochureButton.url || ""}
                label={brochureButton.label}
                target={brochureButton.target}
              />
            )}
            <Footer />
          </div>
        </ClientWrapper>
        {/* </Suspense> */}
        {ENVIROMENT === "production" && <Analytics />}
        {ENVIROMENT === "production" && <SpeedInsights />}
      </body>
    </html>
  );
}
