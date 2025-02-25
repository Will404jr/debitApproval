import React from "react";

export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <div className="h-1/4 bg-[#13263c]" />
        <div className="h-3/4 bg-[#13263c]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
