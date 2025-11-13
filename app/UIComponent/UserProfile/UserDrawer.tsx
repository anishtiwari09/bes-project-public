import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import React from "react";
import {
  Dashboard,
  Person,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  Help,
} from "@mui/icons-material";
import Link from "next/link";

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  onLogout: () => void;
}

const menuItems = [
  { id: 1, name: "Dashboard", icon: Dashboard, path: "/user/dashboard" },
  { id: 2, name: "Profile", icon: Person, path: "/user/profile" },
  { id: 3, name: "My Account", icon: AccountCircle, path: "/user/myaccount" },
  {
    id: 4,
    name: "Notifications",
    icon: Notifications,
    path: "/user/notifications",
  },
  { id: 5, name: "Settings", icon: Settings, path: "/user/settings" },
  { id: 6, name: "Help", icon: Help, path: "/help" },
];

export default function UserDrawer({
  open,
  onClose,
  userName,
  userEmail,
  onLogout,
}: UserDrawerProps) {
  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor={"right"}
      sx={{ zIndex: 99999999999, maxWidth: "100%" }}
    >
      <Box
        sx={{ width: { sm: 350, xs: "100%" }, maxWidth: "100%" }}
        role="presentation"
      >
        {/* User Header */}
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}>
            {userName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
            {userName?.toLowerCase()}
          </Typography>
          {userEmail && (
            <Typography variant="body2" color="text.secondary">
              {userEmail}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Menu Items */}
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                href={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton onClick={onClose}>
                  <ListItemIcon>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </Link>
            );
          })}

          <Divider sx={{ my: 1 }} />

          {/* Logout */}
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
