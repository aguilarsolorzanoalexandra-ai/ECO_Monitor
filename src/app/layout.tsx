import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "ECO-Monitor | Eficiencia Energética para Pequeños Comercios",
  description:
    "Monitoreo de consumo eléctrico, detección de anomalías operativas y simulador de ahorro para kioscos y pequeños comercios. Demostración para Kiosco Central.",
  keywords: [
    "eficiencia energética",
    "kiosco",
    "monitoreo eléctrico",
    "ahorro de energía",
    "ESP32",
    "ECO-Monitor",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-eco-bg text-eco-text flex flex-col md:flex-row antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
