import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// পুরো সাইটের জন্য একটি সুন্দর font লোড করা হলো।
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// এই টাইটেল ব্রাউজারের ট্যাবে দেখা যায়।
export const metadata = {
  title: "DevBlog — Static (JS)",
  description: "Next.js + Tailwind দিয়ে বানানো একটি সহজ ব্লগ।",
};

// RootLayout = প্রতিটি পেজকে Navbar আর Footer দিয়ে মুড়ে দেয়।
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <Navbar />
        {/* children = এই মুহূর্তে যে পেজটি দেখা হচ্ছে */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
