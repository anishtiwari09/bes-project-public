import { Box, Divider, Drawer, List, Typography } from "@mui/material";
import React from "react";
import DataItemLIst from "../Navbar/ClientSide/MobileMenu/DataListItem";

export default function UserDrawer({
  open,
  onClose,
  userName,
  data
}: any) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor={"right"}
      sx={{ zIndex: 99999999999, maxWidth: "100%" }}
    >
      <Box
        sx={{ width: { sm: 450, xs: "100%" }, maxWidth: "100%" }}
        role="presentation"
      >
        <Typography
          variant={"h4"}
          sx={{ fontSize: { xs: 16, md: 32 } }}
          p={2}
          textTransform={"capitalize"}
        >
          welcome, {userName.toLowerCase()}
        </Typography>
        <Divider />

        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <DataItemLIst data={data} parentPath="" />
        </List>
      </Box>
    </Drawer>
  );
}
