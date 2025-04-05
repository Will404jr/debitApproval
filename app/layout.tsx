import localFont from "next/font/local";
import "./globals.css";

// Load Bahnschrift font
const bahnschrift = localFont({
  src: "../fonts/bahnschrift.ttf", // Path relative to app directory
  display: "swap",
  variable: "--font-bahnschrift",
});

export const metadata = {
  title: "Debit Approval System",
  description: "Management system for debit approvals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bahnschrift.variable} font-bahnschrift text-lg`}>
        {children}
      </body>
    </html>
  );
}
