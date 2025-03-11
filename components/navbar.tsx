"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { 
  Menu, 
  X, 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  DollarSign,
  Image,
  LogIn,
  Bot,
  ChevronDown
} from "lucide-react";
import { useAuth } from '@/lib/auth/AuthContext';

const routes = [
  {
    name: "Home",
    path: "/",
    icon: Home
  },
  {
    name: "Schedule",
    path: "/schedule",
    icon: Calendar
  },
  {
    name: "Roster",
    path: "/roster",
    icon: Users
  },
  {
    name: "Communication",
    path: "/communication",
    icon: MessageSquare
  },
  {
    name: "Media",
    path: "/media",
    icon: Image
  },
  {
    name: "Payments",
    path: "/payments",
    icon: DollarSign
  },
  {
    name: "Chatbot",
    path: "/chatbot",
    icon: Bot
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById("mobile-menu");
      if (isOpen && nav && !nav.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className={cn(
      "bg-background border-b sticky top-0 z-50 transition-all duration-200",
      scrolled && "shadow-md"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">Badgers 2014</span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {routes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                      pathname === route.path
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {route.name}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* Desktop Right Side */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <ModeToggle />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/profile">
                      <Button variant="ghost" className="text-sm font-medium text-gray-700">
                        Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login">
                      <Button variant="ghost" className="text-sm font-medium text-gray-700">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="default" className="text-sm font-medium">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Mobile Right Side */}
          <div className="flex items-center md:hidden">
            <ModeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="ml-2 p-2 rounded-full"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-xl transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeMenu}
            className="p-2 rounded-full"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="py-4 overflow-y-auto h-[calc(100%-64px)]">
          <div className="px-2 space-y-1">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors",
                    pathname === route.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                  onClick={closeMenu}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {route.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-6 px-4 py-4 border-t">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/profile">
                      <Button className="w-full h-12 text-base">
                        Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login">
                      <Button className="w-full h-12 text-base">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full h-12 text-base">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay when mobile menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}