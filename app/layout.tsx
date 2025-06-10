import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Prise Médoc",
  description: "rappel de prise de médicaments avec système de notification pour ne plus jamais oublier ses médicaments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        {children}
        {/* <MenuBar /> */}
      </body>
    </html>
  );
}
