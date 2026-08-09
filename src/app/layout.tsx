import type { Metadata, Viewport } from "next";
import { Figtree, Instrument_Serif } from "next/font/google";
import { ReminderBanner } from "@/components/ReminderBanner";
import { SiteNav } from "@/components/SiteNav";
import { CareProvider } from "@/lib/store";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Gaggia Care · Classic E24",
  description:
    "A calm companion for Classic E24 care, HiBREW 5G upkeep, and espresso dialling.",
  appleWebApp: {
    capable: true,
    title: "Gaggia Care",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#eef1f4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CareProvider>
          <SiteNav />
          <ReminderBanner />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--line)]">
            <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-steam sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>Gaggia Care · Classic E24</p>
              <p>Saved in this browser</p>
            </div>
          </footer>
        </CareProvider>
      </body>
    </html>
  );
}
