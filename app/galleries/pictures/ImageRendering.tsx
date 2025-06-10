"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import OpenImage from "./OpenImage";

const ROW_GAP = 2;
const ROW_GAP8 = ROW_GAP * 8;

// Adjust heights to ensure balanced column layout
const adjustHeights = (heights: number[], numberOfParts = 4): number[] => {
  const eachPartsLengths: number[] = [];
  let totalLength = heights.length;

  // Divide the heights into parts
  for (let i = 0; i < numberOfParts && totalLength >= 0; i++) {
    let partSize = Math.floor(totalLength / (numberOfParts - i)) || totalLength;
    eachPartsLengths[i] = partSize;
    totalLength -= partSize;
  }

  const sumOfEachParts: number[] = [];
  let startIdx = 0;

  // Sum up heights for each part
  for (let i = 0; i < numberOfParts; i++) {
    const part = heights.slice(startIdx, startIdx + eachPartsLengths[i]);
    sumOfEachParts[i] =
      part.reduce((acc, h) => acc + h, 0) +
      (eachPartsLengths[i] - 1) * ROW_GAP8;
    startIdx += eachPartsLengths[i];
  }

  // Find maximum height across all parts
  const maxHeight = Math.max(...sumOfEachParts);
  startIdx = 0;

  // Distribute difference in height across columns
  for (let i = 0; i < numberOfParts; i++) {
    let diff = maxHeight - sumOfEachParts[i];
    if (diff && eachPartsLengths[i]) {
      const endIdx = startIdx + eachPartsLengths[i];
      for (let j = 0; j < eachPartsLengths[i] && diff; j++) {
        let avgAdd = Math.floor(diff / (eachPartsLengths[i] - j));
        if (diff <= 30) avgAdd = diff;
        heights[startIdx + j] += avgAdd;
        diff -= avgAdd;
      }
    }
    startIdx += eachPartsLengths[i];
  }

  return heights;
};

interface ImageRenderingProps {
  path: string;
  path2?: string;
  allImage: string[];
  message?: string;
}

const ImageRendering: React.FC<ImageRenderingProps> = ({
  path,
  allImage,
  message,
  path2,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handleOpen = (i: number) => {
    setSelectedImageIndex(i);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImageIndex(null);
  };

  return (
    <div className="flex flex-col">
      <MasonryGallery images={allImage} path={path} handleOpen={handleOpen} />
      {open && selectedImageIndex !== null && (
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
};

interface MasonryGalleryProps {
  images: string[];
  path: string;
  handleOpen: (index: number) => void;
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  images,
  path,
  handleOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const isBelow2XL = useMediaQuery("(max-width: 1920px)");
  const mobileHeight = 300;

  // State to track the heights (manual adjustment happens here)
  const [heights, setHeights] = useState<number[]>([]);

  // State to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Initialize heights once the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const initialHeights = images.map(
        () => 350 + Math.floor(Math.random() * 200)
      );
      setHeights(initialHeights);
    }
  }, [isMounted, images]);

  // Random heights generation for images
  const randomHeights = useMemo(
    () => images.map(() => 350 + Math.floor(Math.random() * 200)),
    [images.length]
  );

  // Adjusted heights (only recalculated when required)
  const balancedHeights = useMemo(() => {
    if (!heights.length) return randomHeights; // Default to random heights if not yet set

    let columnCount = 4;
    if (!md && !isBelow2XL) columnCount = 6;

    return adjustHeights([...heights], columnCount);
  }, [heights, randomHeights, isMobile, md, isBelow2XL]);

  return (
    <Box sx={{ px: 2, py: 4, bgcolor: "#f3f3f3" }}>
      <Box
        sx={{
          columnCount: { xs: 1, sm: 2, md: 4, "2xl": 6 },
        }}
      >
        {images.slice(0, 1000).map((src, i) => (
          <Box
            key={i}
            sx={{
              breakInside: "avoid",
              mb: ROW_GAP,
              borderRadius: 2,
              boxShadow: 1,
              bgcolor: "background.paper",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              ":hover": {
                transform: "scale(1.03)",
              },
              height: isMobile ? mobileHeight : balancedHeights[i],
            }}
            onClick={() => handleOpen(i)}
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

export default ImageRendering;
