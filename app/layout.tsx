import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Prise-Medoc",
  description: "Application de suivi de prise de médicaments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2999125530144516" crossOrigin="anonymous"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Application de gestion de prise de médicaments" />
       <meta name="google-adsense-account" content="ca-pub-2999125530144516"></meta>
        <title>Prise-Medoc</title>
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
