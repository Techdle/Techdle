import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/components/SettingsProvider';
import { Footer } from '@/components/Footer';
import { SecurityProvider } from '@/components/SecurityProvider';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://playtechdle.com'),
  title: "Techdle - The Daily IT Troubleshooting Game",
  description: "Test your IT skills with Techdle, a daily puzzle where you diagnose and solve tech support tickets from a series of clues. Can you find the root cause?",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-192-android.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180-apple-touch.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Techdle - The Daily IT Troubleshooting Game",
    description: "Diagnose daily tech support tickets from clues. Are you a true sysadmin?",
    url: "https://playtechdle.com",
    siteName: "Techdle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techdle - The Daily IT Troubleshooting Game",
    description: "Diagnose daily tech support tickets from clues. Are you a true sysadmin?",
  },
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col transition-colors duration-300`}
      >
        <SettingsProvider>
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
        </SettingsProvider>
      </body>
    </html>
  );
}
