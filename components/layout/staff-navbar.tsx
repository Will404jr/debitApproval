"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LogOut, Bell, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SessionData {
  username: string;
  email: string;
  isLoggedIn: boolean;
}

export function StaffNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch session data when component mounts
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session");
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/"); // Redirect to login page after logout
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const isActive = (path: string) => pathname?.startsWith(path);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-none bg-[#13263c]">
      <div className="container mx-auto px-4 md:px-6 lg:px-20">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link
              href="/staff"
              className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <FileText className="mr-2 h-6 w-6" />
              <span className="hidden sm:inline">Ask your MD</span>
              <span className="sm:hidden">MD</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Navigation - Center (Desktop) */}
          <div className="hidden md:flex justify-center items-center space-x-2">
            {[
              { href: "/staff/home", label: "Home" },
              { href: "/staff/issues", label: "Issues" },
              { href: "/staff/chat", label: "Chat" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-2 rounded-full text-white transition-all
                  hover:bg-white/10 
                  ${
                    isActive(item.href)
                      ? "bg-[#6CBE45] font-medium shadow-sm"
                      : ""
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Profile Menu - Right (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/staff/notifications"
              className="p-2 rounded-full text-white hover:bg-white/10 transition-all"
            >
              <Bell className="h-5 w-5" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:opacity-80"
                >
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarFallback className="bg-white/10 text-white">
                      ST
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.username || "Loading..."}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.email || "Loading..."}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center cursor-pointer p-3 text-red-600 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              {/* Navigation Links */}
              {[
                { href: "/staff/home", label: "Home" },
                { href: "/staff/issues", label: "Issues" },
                { href: "/staff/chat", label: "Chat" },
                { href: "/staff/notifications", label: "Notifications" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-md text-white transition-all
                    hover:bg-white/10 
                    ${
                      isActive(item.href)
                        ? "bg-[#6CBE45] font-medium shadow-sm"
                        : ""
                    }
                  `}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}

              {/* User Info */}
              <div className="px-4 py-3 border-t border-white/10 mt-2">
                <p className="text-sm font-medium text-white">
                  {session?.username || "Loading..."}
                </p>
                <p className="text-xs text-white/70">
                  {session?.email || "Loading..."}
                </p>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                className="flex items-center justify-start px-4 text-red-400 hover:text-red-300 hover:bg-white/5"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
