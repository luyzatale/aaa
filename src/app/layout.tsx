import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { LanguageProvider } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccessibilityBar from "@/components/layout/AccessibilityBar";
import OverwhelmButton from "@/components/features/OverwhelmButton";
import ServiceWorkerRegistration from "@/components/features/ServiceWorkerRegistration";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "A@AA Serenity Path — AA Recovery",
    template: "%s | A@AA Serenity Path",
  },
  description:
    "A peaceful digital recovery sanctuary for people in AA. Calm, accessible, and designed for exhausted minds. Daily reflections, prayers, meetings, and gentle recovery tools.",
  keywords: [
    "AA recovery",
    "Alcoholics Anonymous",
    "sobriety",
    "recovery",
    "12 steps",
    "autistic burnout",
    "neurodivergent recovery",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "A@AA Serenity Path",
  },
  openGraph: {
    title: "A@AA Serenity Path — AA Recovery",
    description: "A peaceful digital recovery sanctuary for exhausted minds.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fefdf8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <LanguageProvider>
        <AccessibilityProvider>
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <AccessibilityBar />
          <OverwhelmButton />
          <ServiceWorkerRegistration />
        </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
