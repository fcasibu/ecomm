import "./globals.css";

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@ecomm/ui/toaster";
import { WindowInfoProvider } from "@faceless-ui/window-info";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerce CMS",
  description: "Manage your ecommerce data with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NuqsAdapter>
          <WindowInfoProvider
            breakpoints={{
              s: "(min-width: 640px)",
              m: "(min-width: 768px)",
              l: "(min-width: 1024px)",
              xl: "(min-width: 1280px)",
            }}
          >
            <Toaster />
            <div className="flex h-screen bg-background text-foreground">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
          </WindowInfoProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
