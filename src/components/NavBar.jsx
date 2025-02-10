"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-[#2c3e50] dark:bg-gray-900 shadow-md px-6 py-3 sticky top-0 z-50 ">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold dark:text-white">
          Shop<span className="text-blue-500">Inventory</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-grow items-center justify-center">
          <div className="flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-md hover:text-[#00796b] ${
                  isActive ? "active" : "text-white"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-md hover:text-[#00796b] ${
                  isActive ? "active" : "text-white"
                }`
              }
            >
              My Shop
            </NavLink>
          </div>
        </div>

        {/* Login Button (visible on large screens) */}
        <div className="hidden lg:block">
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent text-white hover:bg-[#00796b] transition hover:text-white"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#2c3e50] text-white">
              <div className="flex flex-col space-y-4 mt-6">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-md hover:text-[#00796b] ${
                      isActive ? "active" : "text-white"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </NavLink>
                <Link
                  to="/products"
                  className="text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/orders"
                  className="text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Orders
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#00796b]"
                >
                  Login
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
