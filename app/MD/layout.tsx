import type React from "react";
import { MDNavbar } from "@/components/layout/md-navbar";

export default function MDLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MDNavbar />
      <main className="flex-1 container mx-auto p-6">{children}</main>
    </div>
  );
}
