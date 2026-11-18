import { Box, File, Home, ReceiptText, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
const AppSidebar = () => {
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
  return (
    <Sidebar>
      <SidebarContent className="bg-primary text-white mt-10 ">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="my-2">
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="text-lg shadow-md  gap-5">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
