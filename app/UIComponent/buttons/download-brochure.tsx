"use client";

import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Link from "next/link";
import { DYNAMIC_LINK } from "@/app/general/commonPath";

export default function DownloadBrochureButton() {
  return (
    <Link
      href={DYNAMIC_LINK.brochure}
      //   download="brochure.pdf"
      target="_blank"
      rel="noopener noreferrer"
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
          BROCHURE
        </span>

        <DownloadIcon fontSize="medium" />
      </Button>
    </Link>
  );
}
