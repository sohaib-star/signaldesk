import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";

// Italic is load-bearing: estimates are set in italics (see provenance.tsx),
// so load the true italic rather than letting the browser synthesise one.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Display face is only ever set upright; no italic is loaded.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: "%s · SignalDesk",
    default: "SignalDesk",
  },
  description: "A CRM that shows you what needs your attention, and why.",
};

export const viewport: Viewport = {
  // Matches the ink header so mobile browser chrome blends with the app.
  themeColor: "#16181c",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
