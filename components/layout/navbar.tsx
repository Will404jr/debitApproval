"use client";

import React from "react";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const NavItems = React.useCallback(
    () => (
      <>
        <Link href="/">
          <Button
            variant={pathname === "/" ? "secondary" : "ghost"}
            className={cn(
              "text-white hover:text-white w-full justify-start",
              pathname === "/"
                ? "bg-green-500 hover:bg-green-600"
                : "hover:bg-blue-600"
            )}
          >
            Home
          </Button>
        </Link>
        <Link href="/issues">
          <Button
            variant={pathname === "/issues" ? "secondary" : "ghost"}
            className={cn(
              "text-white hover:text-white w-full justify-start",
              pathname === "/issues"
                ? "bg-green-500 hover:bg-green-600"
                : "hover:bg-blue-600"
            )}
          >
            Issues
          </Button>
        </Link>
        <Link href="/chat">
          <Button
            variant={pathname === "/chat" ? "secondary" : "ghost"}
            className={cn(
              "text-white hover:text-white w-full justify-start",
              pathname === "/chat"
                ? "bg-green-500 hover:bg-green-600"
                : "hover:bg-blue-600"
            )}
          >
            Chat with MD
          </Button>
        </Link>
      </>
    ),
    [pathname]
  );

  return (
    <nav className="bg-[#042cb5] px-4 py-4 flex items-center justify-between ml-8 mr-8">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6 text-white"
          >
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-white font-semibold text-lg">Ask your MD</span>
        </Link>
      </div>

      {/* Navigation Items - Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <NavItems />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className={cn(
            "relative hover:opacity-80 transition-opacity",
            pathname === "/notifications" && "opacity-80"
          )}
        >
          <Bell className="h-6 w-6 text-white cursor-pointer" />
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 text-white p-0 text-xs"
            variant="destructive"
          >
            2
          </Badge>
        </Link>
        <Avatar>
          <AvatarImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wjBvVbbCf8JNoE3SHsSn8CpyYKf7P8.png"
            alt="User"
          />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-8 w-10 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-[#042cb5]"
          >
            <div className="flex flex-col gap-4 mt-8">
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
