"use client";
import { useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import OpenImage from "./OpenImage";
import { Box } from "@mui/material";
export default function ImageRendering({
  path,
  allImage,
  message,
  path2,
}: any) {
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState("");

  const handleOpen = (i: any) => {
    setSelectedImageIndex(i);
    setOpen(true);
  };
  const handleClose = (i: any) => {
    setOpen(false);
    setSelectedImageIndex(i);
  };

  return (
    <div className="flex flex-col">
      <MasonryGallery images={allImage} path={path} handleOpen={handleOpen} />
      {open && (
        <OpenImage
          key={selectedImageIndex}
          imagePath={path}
          startIndex={selectedImageIndex}
          open={open}
          handleClose={handleClose}
          data={allImage}
        />
      )}
    </div>
  );
}

// components/MasonryGallery.tsx

interface MasonryGalleryProps {
  images: string[];
  path: string;
  handleOpen: (val: string | number) => void;
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  images,
  path,
  handleOpen,
}) => {
  // Generate random heights only once per render, matching images length

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const heights = React.useMemo(
    () => images.map(() => 350 + Math.floor(Math.random() * 200)),
    [images]
  );
  console.log({ isMobile });
  const mobileHeight = 300;
  return (
    <Box sx={{ px: 2, py: 4, bgcolor: "#f3f3f3" }}>
      <Box
        sx={{
          columnCount: { xs: 1, sm: 2, md: 4, "2xl": 6 },
          columnGap: 2,
        }}
      >
        {images.map((src, i) => (
          <Box
            key={i}
            sx={{
              breakInside: "avoid",
              mb: 2,
              borderRadius: 2,
              boxShadow: 1,
              bgcolor: "background.paper",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              ":hover": {
                transform: "scale(1.03)",
              },
              height: isMobile ? mobileHeight : heights[i],
              fill: "Highlight",
            }}
            onClick={() => {
              handleOpen(i);
            }}
          >
            <img
              src={`${path}/${src}`}
              alt={`Image ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                userSelect: "none",
              }}
              draggable={false}
              loading="lazy"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
