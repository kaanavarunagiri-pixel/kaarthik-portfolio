import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/UI/SmoothScrollProvider";
import { SoundProvider } from "@/components/UI/SoundManager";
import { CustomCursor } from "@/components/Navigation/CustomCursor";
import { Navbar } from "@/components/Navigation/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KAARTHIK | Full Stack Web & App Developer",
  description:
    "Personal portfolio of Kaarthik — Full Stack Web and App Developer specializing in Next.js, Flutter, React Native, Node.js, and high-performance interactive digital experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f5f5f5]">
        <SoundProvider>
          <SmoothScrollProvider>
            <CustomCursor />
            <Navbar />
            <main className="flex-1">{children}</main>
          </SmoothScrollProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
