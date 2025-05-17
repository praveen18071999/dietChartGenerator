import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalSidebar } from "@/components/conditionalSidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToasterProvider } from "@/components/providers/toast-provider";
import { AuthCheck } from "@/utils/auth";
import  AdminPanelLayout  from "@/components/admin-panel/admin-panel-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitFuel",
  description: "Generate personalized diet plans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ConditionalSidebar> <AuthCheck>{children}</AuthCheck>
            <ToasterProvider />
          </ConditionalSidebar>
        </ThemeProvider>
        
      </body>
    </html>
  );
}