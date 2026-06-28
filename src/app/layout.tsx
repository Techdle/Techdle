import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Footer } from '@/components/Footer';
import { SecurityProvider } from '@/components/SecurityProvider';
import { PWAProvider } from '@/components/PWAProvider';
import Script from 'next/script';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const viewport: Viewport = {
  themeColor: '#020617',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://playtechdle.com'),
  title: "Techdle | The Daily IT Diagnosis Game",
  description: "A daily puzzle game for IT professionals, sysadmins, and tech enthusiasts. Decode vague user tickets, read the logs, and diagnose the system failure.",
  keywords: ["techdle", "wordle clone", "IT game", "sysadmin puzzle", "pc repair game", "diagnostic game", "tech support game"],
  verification: {
    google: 'Eavbkk71jiJHtsFIPQNxYoBgsXKcfgk2QBLc3n_YJ-w',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-192-android.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180-apple-touch.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Techdle | The Daily IT Diagnosis Game",
    description: "Decode vague user tickets and diagnose the system failure in 6 guesses or less!",
    url: "https://playtechdle.com",
    siteName: "Techdle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techdle | The Daily IT Diagnosis Game",
    description: "Decode vague user tickets and diagnose the system failure in 6 guesses or less!",
  },
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Techdle",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Any",
  "url": "https://playtechdle.com",
  "description": "The daily IT troubleshooting puzzle game. Diagnose and solve tech support tickets.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('techdle-theme');
    if (!theme) {
      theme = 'dark';
      localStorage.setItem('techdle-theme', 'dark');
    }
    document.documentElement.dataset.theme = theme;
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="google-adsense-account" content="ca-pub-4116593263812421" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4116593263812421"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] flex flex-col transition-colors duration-300`}
      >
        <PWAProvider>
          <ThemeProvider>
            <AuthProvider>
              <SecurityProvider>
                <div className="flex-grow flex flex-col">
                  {children}
                </div>
                <Footer />
              </SecurityProvider>
            </AuthProvider>
          </ThemeProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
