import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./UIComponent/Navbar/Navbar";
import Footer from "./UIComponent/Footer/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import {
  getVisitorCounter,
  updateVisitorCounter,
} from "./backend/helper/visitor_helper/visitor_counter_helper";
import { cookies } from "next/headers";
import { ENVIROMENT } from "./backend/constant";
import DownloadBrochureButton from "./UIComponent/buttons/download-brochure";

// ✅ Global Expo SEO Config
import {
  EXPO_NAME,
  EXPO_DESCRIPTION,
  EXPO_URL,
  EXPO_OG_IMAGE,
} from "./config/expo";

const inter = Inter({ subsets: ["latin"] });

// ✅ GLOBAL SEO (applies to ALL pages — no modification needed anywhere)
export const metadata = {
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

export default async function RootLayout({ children }: any) {
  let intitalCounter = await getVisitorCounter();
  const cookieStore = cookies();
  let besSessionCookies = cookieStore.get("updateCounter")?.value;

  if (besSessionCookies) {
    updateVisitorCounter();
  }

  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">
        <Navbar />

        <div className="overflow-auto inner_page scroll-smooth">
          <div className="body_page">{children}</div>
          <DownloadBrochureButton />
          <Footer initialCount={intitalCounter} />
        </div>

        {ENVIROMENT === "production" && <Analytics />}
        {ENVIROMENT === "production" && <SpeedInsights />}
      </body>
    </html>
  );
}
