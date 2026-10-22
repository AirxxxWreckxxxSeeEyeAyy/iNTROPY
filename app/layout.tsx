import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iNTROPY — Tampa Bay Energy Studio",
  description: "Compare solar and battery scenarios, modeled daily energy costs and editable assumptions. Explore the energy flow and prepare informed installer questions.",
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
