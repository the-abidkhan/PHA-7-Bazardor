import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "bazar dor | BazarDor",
  description: "proyojonio ponnyer dam ek nojore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-theme="light">
      <body className={notoSerifBengali.className}>
        <ToastContainer position="top-right" autoClose={3000} />

        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <Marquee />

        <main className="min-h-screen bg-[#F1F6F1]">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}