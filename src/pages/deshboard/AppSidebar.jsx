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
  CreditCard,
  File,
  Home,
  Lock,
  ReceiptText,
  ScanBarcode,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import useShop from "@/hooks/useShop";
import { isPremium } from "@/utils/subscriptionDates";
import { Link, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 240;

const AppSidebar = ({ mobileOpen, onMobileClose }) => {
  const { pathname } = useLocation();
  const { shop, isShopOwner, canEdit } = useShop();
  const premium = isPremium(shop);

  // Menu items. ownerOnly items (staff management, checkout, settings)
  // only show for the shop owner; hideForViewer items (point of sale)
  // show for everyone who can sell (owner, manager, staff). premium
  // items are paid features — free shops see them with a lock and land
  // on an upgrade wall (PremiumRouter) when they open one.
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
      premium: true,
    },
    {
      title: "Purchase Orders",
      url: "/dashboard/purchase-orders",
      icon: ClipboardList,
      premium: true,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChart3,
      premium: true,
    },
    {
      title: "Point of Sale",
      url: "/dashboard/pos",
      icon: ShoppingCart,
      hideForViewer: true,
      premium: true,
    },
    {
      title: "Scan",
      url: "/dashboard/scan",
      icon: ScanBarcode,
      premium: true,
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: Users,
      ownerOnly: true,
      premium: true,
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
    {
      title: "Subscription",
      url: "/subscription",
      icon: CreditCard,
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
            {item.premium && !premium && (
              <Lock className="h-4 w-4 opacity-60" style={{ flexShrink: 0 }} />
            )}
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
            // The dashboard is an app shell (see DashBoard.jsx): the
            // sidebar fills the row height, so on a short viewport the
            // menu scrolls inside the drawer instead of clipping.
            overflowY: "auto",
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
