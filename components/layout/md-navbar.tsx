"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LogOut, Bell } from "lucide-react";
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

export function MDNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);

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

  return (
    <nav className="border-none bg-[#184285]">
      <div className="container mx-auto px-5">
        <div className="flex h-16 items-center">
          {/* Logo - Left */}
          <div className="w-1/4">
            <Link
              href="/md"
              className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <FileText className="mr-2 h-6 w-6" />
              Ask your MD
            </Link>
          </div>

          {/* Navigation - Center */}
          <div className="flex-1 flex justify-center items-center space-x-2">
            {[
              { href: "/MD/home", label: "Home" },
              { href: "/MD/analysis", label: "Analysis" },
              { href: "/MD/chat", label: "Chat" },
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

          {/* Profile Menu - Right */}
          <div className="w-1/4 flex justify-end items-center space-x-2">
            <Link
              href="/MD/notifications"
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
                      MD
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
      </div>
    </nav>
  );
}
