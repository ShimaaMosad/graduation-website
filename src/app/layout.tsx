import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import MySessionProvider from "../MySessionProvider/MySessionProvider";
import AppShell from "../_components/AppShell/AppShell";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graduation-website",
  description: "AI-powered freelancing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MySessionProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="top-center" />
        </MySessionProvider>
      </body>
    </html>
  );
}