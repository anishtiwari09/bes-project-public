"use client";

import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";
type DownloadBrochureButtonProps = {
  href: string;
  label: string;
  target?: string;
};

export default function DownloadBrochureButton({
  href,
  label,
  target = "_blank",
}: DownloadBrochureButtonProps) {
  const brochureUrl = href || "";
  const handleBrochureDownload = () => {
    trackEvent(AnalyticsEvents.BROCHURE_DOWNLOAD, {
      brochure_name: label?.trim(),
      page: window.location.pathname,
    });
  };
  if (!brochureUrl) return null;

  return (
    <Link
      href={href}
      //   download="brochure.pdf"
      target={target}
      rel="noopener noreferrer"
      onClick={handleBrochureDownload}
      className="fixed z-40 right-2 bottom-2"
    >
      <Button
        variant="contained"
        className="flex flex-col items-center bg-[#222fda] text-[20px] font-[500] hover:bg-[#ffffff] hover:text-[#000] shadow-lg p-2"
        style={{ minWidth: 40, maxWidth: 40 }}
      >
        {/* Icon on top */}

        {/* Vertical Text */}
        <span className="mt-1 [writing-mode:vertical-rl] [text-orientation:upright]  my-2">
          {label}
        </span>

        <DownloadIcon fontSize="medium" />
      </Button>
    </Link>
  );
}
