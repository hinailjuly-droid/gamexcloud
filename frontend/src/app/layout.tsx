import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "H5GAMES SPACE | Play 1000+ Free Browser Games - No Login Required",
  description: "Browse and play premium HTML5 games for free on H5GAMES SPACE. Full-screen experience, zero downloads, and mobile friendly. The ultimate open-source games portal.",
  keywords: "h5games space, h5 games space, h5games, free browser games, open source games, play online, arcade games",
  verification: {
    google: "klhefXtPtglnAChIv7xhLIMBSsdlXOQxO3dlcrckAcI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2724749520266558"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
