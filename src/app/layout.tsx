import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AtelierProvider } from "@/context/AtelierContext";
import { StoreProvider } from "@/context/StoreContext";
import connectToDatabase from "@/lib/db";
import { Product } from "@/lib/models";
import { GARMENTS } from "@/lib/garments";
import Script from "next/script";

export const dynamic = 'force-dynamic';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ABSTRACT // Premium Couture Studio",
  description: "Premium fashion boutique with virtual Fit-On Atelier studio for next-gen apparel.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialProducts = [];
  try {
    await connectToDatabase();
    const rawProducts = await Product.find({}).sort({ _id: -1 }).lean();
    initialProducts = JSON.parse(JSON.stringify(rawProducts));
  } catch (error) {
    console.error("Failed to prefetch products in server layout:", error);
    initialProducts = GARMENTS;
  }

  if (!initialProducts || initialProducts.length === 0) {
    initialProducts = GARMENTS;
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--theme-bg)] text-white">
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
        <StoreProvider initialProducts={initialProducts}>
          <AtelierProvider>
            {children}
          </AtelierProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
