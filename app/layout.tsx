import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import CustomCursorLoader from "@/components/CustomCursorLoader";
import LoadingScreen from "@/components/LoadingScreen";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.raihaanhumris.my.id"),
  title: {
    default: "Raihaan Humris | Fullstack Engineer",
    template: "%s | Raihaan Humris"
  },
  description: "Portofolio Raihaan Humris, Fullstack Systems Architect - Engineering the Digital Monolith. Layanan pengembangan website profesional di NTT.",
  keywords: ["Raihaan Humris", "Fullstack Engineer", "Web Developer", "Software Engineer", "Next.js", "Portfolio"],
  authors: [{ name: "Raihaan Humris" }],
  creator: "Raihaan Humris",
  
  // 1. SOLUSI LOGO: Menimpa favicon bawaan Vercel
  icons: {
    icon: [
      { url: "/favicon.ico", href: "/favicon.ico" }, // Favicon utama
    ],
    apple: [
      { url: "/favicon.ico", href: "/favicon.ico" }, // Untuk shortcut di iOS
    ],
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.raihaanhumris.my.id",
    title: "Raihaan Humris | Fullstack Engineer",
    description: "Portofolio Raihaan Humris, Fullstack Systems Architect.",
    siteName: "Raihaan Humris Portfolio",
    images: [
      {
        url: "/about.jpg",
        width: 1200,
        height: 630,
        alt: "Raihaan Humris",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raihaan Humris | Fullstack Engineer",
    description: "Portofolio Raihaan Humris.",
    images: ["/about.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Raihaan Humris",
    "image": "https://www.raihaanhumris.my.id/about.jpg",
    "jobTitle": "Fullstack Engineer",
    "url": "https://www.raihaanhumris.my.id",
    "sameAs": [
      "https://github.com/ReyhanHumris",
      "https://linkedin.com/in/raihaanhumris"
    ]
  };

  return (
    <html lang="id" className={`dark ${manrope.variable}`}>
      <head>
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to cdnjs for faster font loading */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        
        {/* Font Awesome 6 */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${manrope.className} bg-surface text-on-surface antialiased flex flex-col min-h-screen`}>
        <LoadingScreen />
        <CustomCursorLoader />
        {children}
      </body>
    </html>
  );
}