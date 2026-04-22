import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = "https://laanmets.ee";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Kevin Laanmets — Kinnisvaramaakler Tallinnas | Kodumaa",
    template: "%s | Kevin Laanmets Kinnisvaramaakler",
  },

  description:
    "Kevin Kristofer Laanmets on usaldusväärne kinnisvaramaakler Tallinnas ja Harjumaal. Aitan müüa, osta ja üürida kinnisvara — tasuta konsultatsioon, kiire tulemus, keskmine tehinguaeg alla 70 päeva.",

  keywords: [
    // Isikubränd
    "Kevin Kristofer Laanmets",
    "Kevin Kristofer Laanmets kinnisvaramaakler",
    "Kevin Kristofer Laanmets kinnisvara",
    "Kevin Kristofer Laanmets maakler Eesti",
    "maakler Kevin Kristofer Laanmets",
    "Kevin Laanmets",
    "Kevin Laanmets kinnisvaramaakler",
    "Kevin Laanmets kinnisvara",
    "Kevin Laanmets maakler Eesti",
    "maakler Kevin Laanmets",
    "Kristofer Laanmets",
    "Kristofer Laanmets kinnisvaramaakler",
    "Kristofer Laanmets kinnisvara",
    "Kristofer Laanmets maakler Eesti",
    "maakler Kristofer Laanmets",
    // Üldised
    "kinnisvaramaakler Eesti",
    "kinnisvaramaakler Tallinn",
    "kinnisvara müük Tallinn",
    "korteri müük maakler",
    "maja müük maakler",
    "kinnisvara ost müük",
    "usaldusväärne kinnisvaramaakler",
    // Ostjale
    "korteri ost Tallinn",
    "maja ost Eesti",
    "kinnisvara otsimine maakleriga",
    "uus korter Tallinn",
    "kinnisvaranõustamine",
    "kinnisvara ostunõuanne",
    // Müüjale
    "kuidas müüa korterit Tallinnas",
    "korteri müük kiirelt",
    "kinnisvara hindamine Tallinn",
    "maakler korteri müügiks",
    "tasuta kinnisvara hindamine",
    "kui kaua korteri müük aega võtab",
    // Piirkondlikud
    "kinnisvaramaakler Harjumaa",
    "kinnisvaramaakler Põhja-Tallinn",
    "kinnisvaramaakler Mustamäe",
    "kinnisvaramaakler Kristiine",
    "kinnisvaramaakler Lasnamäe",
    "kinnisvaramaakler Tartu",
    "kinnisvaramaakler Pärnu",
    // Long-tail
    "parim kinnisvaramaakler Tallinnas 2025",
    "mitu protsenti võtab maakler",
    "kinnisvaramaakleri teenustasu",
    "kas tasub kasutada maaklerit",
    "maakler vs ise müüa",
    "kinnisvaramaakler ilma lepinguta",
    "erakliendile kinnisvaramaakler",
  ],

  authors: [{ name: "Kevin Kristofer Laanmets", url: BASE_URL }],
  creator: "Kevin Kristofer Laanmets",

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "profile",
    locale: "et_EE",
    url: BASE_URL,
    siteName: "Kevin Laanmets — Kinnisvaramaakler",
    title: "Kevin Kristofer Laanmets — Kinnisvaramaakler Tallinnas",
    description:
      "Usaldusväärne kinnisvaramaakler Tallinnas ja Harjumaal. Tasuta konsultatsioon, läbipaistev protsess, kiire tulemus.",
    images: [
      {
        url: "/laanmets.jpg",
        width: 1200,
        height: 630,
        alt: "Kevin Kristofer Laanmets — Kinnisvaramaakler Tallinnas",
      },
    ],
    firstName: "Kevin Kristofer",
    lastName: "Laanmets",
    username: "kevin.laanmets",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kevin Kristofer Laanmets — Kinnisvaramaakler Tallinnas",
    description:
      "Usaldusväärne kinnisvaramaakler Tallinnas ja Harjumaal. Tasuta konsultatsioon, läbipaistev protsess, kiire tulemus.",
    images: ["/laanmets.jpg"],
  },

  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

// JSON-LD struktureeritud andmed — isik + ettevõte
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Kevin Kristofer Laanmets",
      jobTitle: "Kinnisvaramaakler",
      url: BASE_URL,
      telephone: "+37253935292",
      email: "kevin@kodumaa.ee",
      image: `${BASE_URL}/laanmets.jpg`,
      sameAs: [
        "https://www.instagram.com/kevin.laanmets",
        "https://www.facebook.com/kevin.laanmets",
        "https://www.kv.ee/broker/kevinkristoferlaanmets",
      ],
      worksFor: {
        "@type": "RealEstateAgent",
        name: "Kodumaa",
        url: "https://kodumaa.ee",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tallinn",
        addressCountry: "EE",
      },
      knowsAbout: [
        "Kinnisvara müük",
        "Kinnisvara ost",
        "Kinnisvara üürimine",
        "Kinnisvaraturg Tallinn",
        "Kinnisvaraturg Harjumaa",
      ],
    },
    {
      "@type": "RealEstateAgent",
      "@id": `${BASE_URL}/#business`,
      name: "Kevin Laanmets — Kinnisvaramaakler",
      url: BASE_URL,
      telephone: "+37253935292",
      email: "kevin@kodumaa.ee",
      image: `${BASE_URL}/laanmets.jpg`,
      logo: `${BASE_URL}/kevin_logo.png`,
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tallinn",
        addressRegion: "Harjumaa",
        addressCountry: "EE",
      },
      areaServed: [
        { "@type": "City", name: "Tallinn" },
        { "@type": "AdministrativeArea", name: "Harjumaa" },
        { "@type": "AdministrativeArea", name: "Raplamaa" },
        { "@type": "Country", name: "Eesti" },
      ],
      sameAs: [
        "https://www.instagram.com/kevin.laanmets",
        "https://www.facebook.com/kevin.laanmets",
        "https://www.kv.ee/broker/kevinkristoferlaanmets",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: "100",
        bestRating: "5",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="et" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-canvas text-dark antialiased w-full max-w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
