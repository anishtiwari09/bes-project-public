import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const OpenImage = ({
  open,
  handleClose,
  imagePath,
  data,
  startIndex
}: any) => {
  console.log(startIndex);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      style={{ zIndex: 9999999 }}
      PaperProps={{ style: { overflow: "hidden" } }}
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
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ padding: 1, overflow: "hidden" }}>
        <Carousel
          autoPlay={false}
          animation={"slide"}
          indicators={true}
          stopAutoPlayOnHover={true}
          interval={5000}
          index={startIndex}
          strictIndexing={true}
          height={"calc(100vh - 164px)"}
          swipe={true}
          cycleNavigation={false}
          className="static"
          navButtonsAlwaysVisible={true}
        >
          {data?.map((item: any, key: any) => (
            <Box
              component="img"
              src={`${imagePath}/${item}`}
              alt={item}
              key={key}
              sx={{
                width: "100%",
                maxWidth: "100%",
                height: "auto",
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
