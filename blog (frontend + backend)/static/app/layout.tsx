import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Load a clean Google font for the whole site
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "DevBlog — Share what you learn",
  description: "A simple blog built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* min-h-screen + flex-col keeps the footer at the bottom on short pages */}
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <Navbar />
        {/* flex-1 makes the page content grow to fill remaining space */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
