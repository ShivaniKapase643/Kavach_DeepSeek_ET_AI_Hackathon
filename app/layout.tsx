import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kavach — Real-time Digital Arrest Scam Shield",
  description:
    "An AI guardian that listens to the call as it happens, recognises the digital arrest scam script mid-sentence, and interrupts in the victim's own language — before the money moves.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-bg text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
