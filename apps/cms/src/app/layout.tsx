import "./globals.css";

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@ecomm/ui/toaster";
import { WindowInfoProvider } from "@faceless-ui/window-info";
import { StoreProvider } from "@/features/store/providers/store-provider";
import { getStoreByLocale } from "@/features/store/services/queries";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { getCookieCurrentLocale } from "@/lib/get-cookie-current-locale";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerce CMS",
  description: "Manage your ecommerce data with ease",
};

async function Providers({ children }: React.PropsWithChildren) {
  const locale = await getCookieCurrentLocale();
  const store = await getStoreByLocale(locale);

  return (
    <StoreProvider store={store.success ? store.data : null}>
      <NuqsAdapter>
        <WindowInfoProvider
          breakpoints={{
            s: "(min-width: 640px)",
            m: "(min-width: 768px)",
            l: "(min-width: 1024px)",
            xl: "(min-width: 1280px)",
          }}
        >
          {children}
        </WindowInfoProvider>
      </NuqsAdapter>
    </StoreProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto p-8 space-y-8 flex justify-center items-center h-full">
              <Loader className="animate-spin" />
            </div>
          }
        >
          <Providers>
            <Toaster />
            <Header />
            <div className="flex h-screen bg-background text-foreground">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
