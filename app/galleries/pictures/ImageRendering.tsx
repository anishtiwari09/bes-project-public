"use client";
import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import React, { useState } from "react";
import OpenImage from "./OpenImage";

export default function ImageRendering({
  path,
  allImage,
  message,
  path2
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
      <ImageList
        sx={{ width: "fit-content", padding: 5 }}
        cols={5}
        rowHeight={160}
        gap={20}
      >
        {allImage.map((item: any, index: any) => (
          <ImageListItem key={index} onClick={() => handleOpen(index)}>
            <img
              src={`${path}/${item}?w=164&h=164&fit=crop&auto=format`}
              alt={item}
              srcSet={`${path}/${item}?w=164&h=164&fit=crop&auto=format`}
              className="cursor-pointer"
              loading="lazy"
              style={{ maxHeight: "100%", maxWidth: "100%" }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      {open && (
        <OpenImage
          key={selectedImageIndex}
          imagePath={path}
          startIndex={selectedImageIndex}
          open={true}
          handleClose={handleClose}
          data={allImage}
        />
      )}
    </div>
  );
}
