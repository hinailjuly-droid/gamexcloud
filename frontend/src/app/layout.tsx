import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAMXCLOUD | Play 1000+ Free Browser Games - No Login Required",
  description: "Browse and play premium HTML5 games for free on GAMXCLOUD. Full-screen experience, zero downloads, and mobile friendly. The ultimate open-source games portal.",
  keywords: "gamxcloud, gamx cloud, h5games, free browser games, open source games, play online, arcade games",
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
        <script
          async
          data-ad-client="ca-pub-2724749520266558"
          data-ad-frequency-hint="30s"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2724749520266558"
          crossOrigin="anonymous"
        ></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.adsbygoogle = window.adsbygoogle || [];
            window.adConfig = function(o) {adsbygoogle.push({google_ad_modality: 'interstitial', ...o});};
            window.adBreak = function(o) {adsbygoogle.push(o);};
          `
        }} />
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
