"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import OpenImage from "./OpenImage";

/* =====================
   Constants
===================== */
const ROW_GAP = 2;
const ROW_GAP8 = ROW_GAP * 8;
const MOBILE_HEIGHT = 300;
const FALLBACK_HEIGHT = 450; // IMPORTANT: used on first render

/* =====================
   Height Balancer
===================== */
const adjustHeights = (heights: number[], numberOfParts = 4): number[] => {
  const eachPartsLengths: number[] = [];
  let totalLength = heights.length;

  for (let i = 0; i < numberOfParts && totalLength >= 0; i++) {
    const partSize =
      Math.floor(totalLength / (numberOfParts - i)) || totalLength;
    eachPartsLengths[i] = partSize;
    totalLength -= partSize;
  }

  const sumOfEachParts: number[] = [];
  let startIdx = 0;

  for (let i = 0; i < numberOfParts; i++) {
    const part = heights.slice(startIdx, startIdx + eachPartsLengths[i]);
    sumOfEachParts[i] =
      part.reduce((acc, h) => acc + h, 0) +
      (eachPartsLengths[i] - 1) * ROW_GAP8;
    startIdx += eachPartsLengths[i];
  }

  const maxHeight = Math.max(...sumOfEachParts);
  startIdx = 0;

  for (let i = 0; i < numberOfParts; i++) {
    let diff = maxHeight - sumOfEachParts[i];
    if (diff && eachPartsLengths[i]) {
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

/* =====================
   ImageRendering
===================== */
interface ImageRenderingProps {
  path: string;
  allImage: string[];
  message?: string;
}

const ImageRendering: React.FC<ImageRenderingProps> = ({ path, allImage }) => {
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  return (
    <div className="flex flex-col">
      <MasonryGallery
        images={allImage}
        path={path}
        handleOpen={(i) => {
          setSelectedImageIndex(i);
          setOpen(true);
        }}
      />

      {open && selectedImageIndex !== null && (
        <OpenImage
          key={selectedImageIndex}
          imagePath={path}
          startIndex={selectedImageIndex}
          open={open}
          handleClose={() => setOpen(false)}
          data={allImage}
        />
      )}
    </div>
  );
};

/* =====================
   MasonryGallery
===================== */
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

  const [heights, setHeights] = useState<number[]>([]);

  /* Generate deterministic heights AFTER mount */
  useEffect(() => {
    const generated = images.map(() => 350 + Math.floor(Math.random() * 200));
    setHeights(generated);
  }, [images]);

  const balancedHeights = useMemo(() => {
    if (!heights.length) return [];
    return adjustHeights([...heights], 4);
  }, [heights]);

  return (
    <Box sx={{ px: 2, py: 4, bgcolor: "#f3f3f3" }}>
      <Box
        sx={{
          columnCount: { xs: 1, sm: 2, md: 4, "2xl": 6 },
        }}
      >
        {images.map((src, i) => {
          const itemHeight = isMobile
            ? MOBILE_HEIGHT
            : balancedHeights[i] ?? FALLBACK_HEIGHT;

          return (
            <Box
              key={src}
              sx={{
                breakInside: "avoid",
                mb: ROW_GAP,
                borderRadius: 2,
                boxShadow: 1,
                bgcolor: "background.paper",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                ":hover": { transform: "scale(1.03)" },
                height: itemHeight,
              }}
              onClick={() => handleOpen(i)}
            >
              <Image
                src={`${path}/${src}`}
                alt={`Image ${i + 1}`}
                width={600}
                height={itemHeight} // ALWAYS defined
                sizes="(max-width: 600px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  userSelect: "none",
                }}
                draggable={false}
                priority={i < 4}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ImageRendering;
