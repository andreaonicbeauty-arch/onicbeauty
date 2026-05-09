import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONIC Beauty Backoffice",
  description: "Agenda, clientes, citas y tratamientos de ONIC Beauty."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
