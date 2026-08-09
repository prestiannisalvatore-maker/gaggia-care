import type { Metadata, Viewport } from "next";
import { Figtree, Instrument_Serif } from "next/font/google";
import { ManualReference } from "@/components/ManualReference";
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
    "Maintenance companion for the Gaggia Classic E24, HiBREW 5G grinder, and barista accessories — schedules, descaling guidance, and reminders.",
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
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-steam sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>Gaggia Care · Built for a Classic E24 purchased August 2026</p>
                <p>Local progress is saved in this browser</p>
              </div>
              <ManualReference variant="footer" />
            </div>
          </footer>
        </CareProvider>
      </body>
    </html>
  );
}
