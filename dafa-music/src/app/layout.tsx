import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SidebarLayout from "@/components/layout/SidebarLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dafa Music Management",
  description: "Management system for Dafa Music Class",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
