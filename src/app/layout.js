import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Barrio Colombiano",
  description: "El mejor directorio de Negocios.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link rel="icon" href="/favicon.ico" />
      <Analytics/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
