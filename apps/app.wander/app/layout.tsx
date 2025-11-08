import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import OuterWrapper from "./OuterWrapper";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['100','200','300','400','500','600','700','800','900']
})

export const metadata: Metadata = {
  title: "Wander - Virtual Spaces",
  description: "Create and join virtual spaces for collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <OuterWrapper>
        {children}
        </OuterWrapper>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
