import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { portfolio } from "@/config/portfolio";
import type { Palette } from "@/types/portfolio";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

const { site, person, links, theme } = portfolio;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: person.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: site.title,
    description: site.description,
    siteName: person.name,
  },
  twitter: { card: "summary_large_image" },
};

const cssVars = (palette: Palette) =>
  Object.entries(palette)
    .map(([key, value]) => `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value}`)
    .join(";");

const themeCss = `:root{${cssVars(theme.light)}}[data-theme="dark"]{${cssVars(theme.dark)}}`;

// Runs before first paint so the saved / default theme never flashes.
const themeScript = `(function(){try{var m=localStorage.getItem("theme")||${JSON.stringify(
  theme.defaultMode,
)};if(m==="system")m=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=m}catch(e){}})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  email: `mailto:${person.email}`,
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: person.location },
  sameAs: links.map((link) => link.url),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Without JavaScript nothing would ever reveal the scroll-in content. */}
        <noscript>
          <style>{".reveal{opacity:1;transform:none}"}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
