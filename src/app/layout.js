import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata = {
  title: "Grand Trust Bank — Banking Beyond Boundaries",
  description: "Premium digital banking with cutting-edge security and world-class features.",
  keywords: "online banking, digital bank, Grand Trust Bank, GTB, fintech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full antialiased bg-gtb-dark text-white">
        {children}

        {process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID && (
          <Script id="tawkto-widget" strategy="afterInteractive">
            {`
              var Tawk_API = Tawk_API || {};
              var Tawk_LoadStart = new Date();
              (function () {
                var s1 = document.createElement("script");
                var s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = 'https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID}/${process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID}';
                s1.charset = 'UTF-8';
                s1.setAttribute('crossorigin', '*');
                s0.parentNode.insertBefore(s1, s0);
              })();
            `}
          </Script>
        )}
      </body>
    </html>
  );
}