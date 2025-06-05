import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useMediaQuery, useTheme } from "@mui/material";

const OpenImage = ({ open, handleClose, imagePath, data, startIndex }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log({ isMobile });
  const height = isMobile
    ? {
        height: isMobile ? 650 : "initial",
        maxHeight: isMobile ? 650 : "initial",
      }
    : {};
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"xl"}
      fullWidth
      style={{ zIndex: 9999999 }}
      PaperProps={{
        style: {
          overflow: "hidden",
          background: "#000",

          padding: "5px",
          borderRadius: "15px",
          ...height,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        px={2}
        sx={{ postion: "relative", zIndex: 99999 }}
      >
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          padding: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Carousel
          autoPlay={false}
          animation={"slide"}
          indicators={true}
          stopAutoPlayOnHover={true}
          interval={5000}
          index={startIndex}
          strictIndexing={true}
          sx={{ width: "100%", height: "fit-content" }}
          swipe={true}
          cycleNavigation={false}
          className="static"
          navButtonsAlwaysVisible={true}
          IndicatorIcon={false}
        >
          {data?.map((item: any, key: any) => (
            <Box
              component="img"
              src={`${imagePath}/${item}`}
              alt={item}
              key={key}
              id="item-id"
              sx={{
                width: "100%",
                maxWidth: "100%",

                // Subtract height for the close button and padding
                objectFit: "contain",
              }}
            />
          ))}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default OpenImage;
