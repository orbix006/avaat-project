import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { RootLayoutContent } from "@/components/layout/RootLayoutContent";
import { Cursor } from "@/components/ui/Cursor";
import { Loader } from "@/components/ui/Loader";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { MotionConfig } from "framer-motion";
import { ToastProvider } from "@/components/ui/Toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://avaat.design'),
  title: {
    default: "Avaat Design | Premium Architectural & Interior Design Studio",
    template: "%s | Avaat Design",
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  description:
    "Avaat Design is a premium architectural and interior design studio creating refined spaces that balance beauty, functionality, and individuality across India.",
  keywords: [
    "interior design",
    "architectural design",
    "luxury interior design",
    "space planning",
    "3D visualization",
    "renovation remodeling",
    "furniture selection",
    "residential design",
    "commercial interior design",
    "Avaat Design",
    "bespoke interiors India",
    "architectural studio",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://avaat.design",
    siteName: "Avaat Design",
    title: "Avaat Design | Premium Architectural & Interior Design Studio",
    description:
      "Avaat Design is a premium architectural and interior design studio creating refined spaces that balance beauty, functionality, and individuality.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Avaat Design - Premium Architectural & Interior Design Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avaat Design | Premium Architectural & Interior Design Studio",
    description: "Premium architectural and interior design studio crafting exceptional spaces across India.",
    creator: "@avaatdesign",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} suppressHydrationWarning>
      <body className="bg-warm-black text-ivory min-h-screen flex flex-col cursor-none antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <MotionConfig reducedMotion="user">
            <LenisProvider>
              <ToastProvider>
                <Loader />
                <Cursor />
                <RootLayoutContent>
                  {children}
                </RootLayoutContent>
                <Suspense fallback={null}>
                  <GoogleAnalytics />
                </Suspense>
                <Analytics />
              </ToastProvider>
            </LenisProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}

