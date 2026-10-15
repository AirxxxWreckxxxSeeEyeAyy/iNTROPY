import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iNTROPY — Tampa Bay Energy Studio",
  description: "Solar and battery scenario planning for customer presentations. Compare energy flows, storage configurations and estimated operating costs.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
