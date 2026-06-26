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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
