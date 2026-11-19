/* eslint-disable react/prop-types */
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { Box, File, Home, ReceiptText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 240;

const AppSidebar = ({ mobileOpen, onMobileClose }) => {
  const { pathname } = useLocation();

  // Menu items.
  const items = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Product",
      url: "/dashboard/products",
      icon: Box,
    },
    {
      title: "Order",
      url: "/dashboard/orders",
      icon: File,
    },
    {
      title: "Checkout",
      url: "/dashboard/checkout",
      icon: ReceiptText,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const navList = (
    <List
      subheader={
        <ListSubheader
          sx={{
            backgroundColor: "transparent",
            color: "text.secondary",
          }}
        >
          Application
        </ListSubheader>
      }
    >
      {items.map((item) => (
        <ListItem key={item.title} disablePadding sx={{ my: 0.5 }}>
          <ListItemButton
            component={Link}
            to={item.url}
            selected={pathname === item.url}
            onClick={onMobileClose}
            sx={{
              color: "text.primary",
              gap: 2,
              "&.Mui-selected": {
                backgroundColor: "action.selected",
                color: "primary.main",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "action.selected",
              },
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <item.icon className="h-5 w-5" />
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{ fontSize: "1.125rem" }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            backgroundColor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        {navList}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
            color: "text.primary",
            borderRight: "1px solid",
            borderColor: "divider",
            // In-flow sidebar (like the old shadcn sidebar): MUI's drawer
            // paper is position: fixed by default, which would overlay the
            // navbar and the main content. Relative keeps it inside the
            // flex row, below the navbar, next to the content.
            position: "relative",
          },
        }}
      >
        {navList}
      </Drawer>
    </>
  );
};

export default AppSidebar;
