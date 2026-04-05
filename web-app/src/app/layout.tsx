import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers/Providers";
import AppWrapper from "../components/AppWrapper";

// 1. Import your persistent UI components
import Sidebar from "../components/sidebar/Sidebar";
import HeaderBar from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legal AI",
  description: "AI-powered legal research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Added bg-[#050505] to your body so the dark theme is global */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505]`}
      >
        <Providers>
          <AppWrapper>
            {/* 3. PASTE YOUR UI SHELL HERE */}
            <main className="p-4 h-screen w-screen">
              <div className="flex rounded-[28px] h-full w-full bg-white/10 p-4 gap-4">
                {/* Sidebar doesn't need state anymore! */}
                <Sidebar />

                <div className="flex flex-1 flex-col px-6">
                  {/* HeaderBar will figure out its own title later */}
                  <HeaderBar />

                  <div className="flex-1 bg-white/10 rounded-[24px] overflow-hidden">
                    {/* Next.js injects page.tsx or discover/page.tsx right here! */}
                    {children}
                  </div>
                </div>
              </div>
            </main>
          </AppWrapper>
        </Providers>
      </body>
    </html>
  );
}
