import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milet | Transparência Radical no Mercado Livre de Energia",
  description: "Diagnóstico e comparação independente de contratos no mercado livre de energia e geração distribuída para pequenas e médias empresas.",
  applicationName: "Milet",
  keywords: ["mercado livre de energia", "geração distribuída", "redução de custos", "PME", "gestão energética", "ANEEL", "transparência"],
  authors: [{ name: "EverGreen Agency / Milet Team" }],
  openGraph: {
    title: "Milet | Energia em Mais Liberdade",
    description: "Compare propostas reais e descubra seu potencial de economia sem comissões ocultas.",
    url: "https://milet.vercel.app",
    siteName: "Milet",
    locale: "pt_BR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Milet | Energia em Mais Liberdade",
    description: "Diagnóstico transparente e sem economês para sua empresa economizar na conta de luz."
  }
};

export const viewport: Viewport = {
  themeColor: "#CC8800",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--color-milet-amber)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
