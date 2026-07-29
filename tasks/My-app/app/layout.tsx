import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Aurex",
  description: "Creative Agency Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <Navbar />

        <main className="pt-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}