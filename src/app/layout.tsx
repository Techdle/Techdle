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
  title: "Techdle",
  description: "A daily IT troubleshooting puzzle game.",
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
