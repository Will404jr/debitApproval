import type React from "react";

export default function Background({
  children,
  imageUrl = "/imgs/nssf.jpg",
}: {
  children: React.ReactNode;
  imageUrl?: string;
}) {
  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
