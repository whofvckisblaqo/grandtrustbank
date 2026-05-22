import { Geist } from "next/font/google";
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
      <body className="min-h-full antialiased bg-gtb-dark text-white">{children}</body>
    </html>
  );
}
