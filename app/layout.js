import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Pixlate Studio - Premium Image Pixel-Sorting & Shuffling Tool",
  description: "High-performance image pixel sorting, shuffling, and custom processing. Customize sorting threshold, dimensions, color-sorting, and reverse operations dynamically.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
