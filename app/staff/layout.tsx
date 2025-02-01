import { StaffNavbar } from "@/components/layout/staff-navbar";
import type React from "react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <StaffNavbar />
      <main className="flex-1 container mx-auto p-6">{children}</main>
    </div>
  );
}
