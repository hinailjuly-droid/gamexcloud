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
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2724749520266558"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <Script id="adsense-config" strategy="afterInteractive">
          {`
            window.adsbygoogle = window.adsbygoogle || [];
            window.adConfig = function(o) {adsbygoogle.push({google_ad_modality: 'interstitial', ...o});};
            window.adBreak = function(o) {adsbygoogle.push(o);};
          `}
        </Script>
        
        {/* Taboola Pixel Code */}
        <Script id="taboola-pixel" strategy="afterInteractive">
          {`
            window._tfa = window._tfa || [];
            window._tfa.push({notify: 'event', name: 'page_view', id: 1888730});
            !function (t, f, a, x) {
              if (!document.getElementById(x)) {
                t.async = 1; t.src = a; t.id=x; f.parentNode.insertBefore(t, f);
              }
            }(document.createElement('script'),
            document.getElementsByTagName('script')[0],
            '//cdn.taboola.com/libtrc/unip/1888730/tfa.js',
            'tb_tfa_script');
          `}
        </Script>
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
