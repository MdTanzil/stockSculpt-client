/* eslint-disable react/prop-types */
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import {
  BarChart3,
  Box,
  ClipboardList,
  File,
  Home,
  ReceiptText,
  ScanBarcode,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import useShop from "@/hooks/useShop";
import { Link, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 240;

const AppSidebar = ({ mobileOpen, onMobileClose }) => {
  const { pathname } = useLocation();
  const { isShopOwner, canEdit } = useShop();

  // Menu items. ownerOnly items (staff management, checkout, settings)
  // only show for the shop owner; hideForViewer items (point of sale)
  // show for everyone who can sell (owner, manager, staff).
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
      title: "Suppliers",
      url: "/dashboard/suppliers",
      icon: Truck,
    },
    {
      title: "Purchase Orders",
      url: "/dashboard/purchase-orders",
      icon: ClipboardList,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      title: "Point of Sale",
      url: "/dashboard/pos",
      icon: ShoppingCart,
      hideForViewer: true,
    },
    {
      title: "Scan",
      url: "/dashboard/scan",
      icon: ScanBarcode,
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: Users,
      ownerOnly: true,
    },
    {
      title: "Checkout",
      url: "/dashboard/checkout",
      icon: ReceiptText,
      ownerOnly: true,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      ownerOnly: true,
    },
  ];

  const visibleItems = items.filter(
    (item) =>
      (!item.ownerOnly || isShopOwner) &&
      (!item.hideForViewer || canEdit)
  );

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
      {visibleItems.map((item) => (
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
