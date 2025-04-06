"use client";

import type * as React from "react";
import { useState, useEffect } from "react";
import {
  Command,
  LayoutDashboard,
  Users,
  Building,
  Shield,
  FileText,
  LogOut,
  CreditCard,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SessionData {
  isLoggedIn: boolean;
  email: string;
  userType: string;
  expiresAt: number;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Banks",
    url: "/banks",
    icon: Building,
  },
  {
    title: "Admins",
    url: "/admins",
    icon: Shield,
  },
  {
    title: "Debit Reports",
    url: "/debit-reports",
    icon: FileText,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch("/api/session");
        if (!response.ok) throw new Error("Failed to fetch session data");
        const data = await response.json();
        setSessionData(data);
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("Failed to load session data");
      }
    };

    fetchSessionData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <Sidebar
      variant="inset"
      {...props}
      className="bg-[#094171] text-white text-xl"
    >
      <SidebarHeader className="pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-semibold">Debit Approval</span>
                  <span className="truncate text-xs">Management System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className="data-[active=true]:bg-white data-[active=true]:text-[#094171] data-[active=true]:rounded-md"
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto pb-4">
        <div className="px-4 py-2">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=30&width=30"
                alt="User"
              />
              <AvatarFallback className="bg-white text-black">
                <Users className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{sessionData?.email}</span>
              <span className="text-xs opacity-70">Administrator</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-none text-white bg-red-600 hover:bg-white hover:text-[#094171]"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
