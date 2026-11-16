import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AdvisorFlow AI | Reduce Financial Advisory Admin by 80%",
  description:
    "Turn meeting notes into client-ready follow-ups, advisor action lists and CRM summaries in seconds.",
  keywords: [
    "financial adviser",
    "meeting notes",
    "AI assistant",
    "financial planning",
    "administrative automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}