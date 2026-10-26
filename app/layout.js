import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--fonte",
});

// Fonte dos números, contadores e etiquetas técnicas.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--fonte-mono",
});

export const metadata = {
  title: "Meu CRM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
