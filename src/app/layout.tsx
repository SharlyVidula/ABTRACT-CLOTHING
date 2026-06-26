import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AtelierProvider } from "@/context/AtelierContext";
import { StoreProvider } from "@/context/StoreContext";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--theme-bg)] text-white">
        <StoreProvider>
          <AtelierProvider>
            {children}
          </AtelierProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
