import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, SidebarItem } from "./components/Sidebar";
import { Home, Settings, Package, ScanBarcode, Search, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "MouvStock",
  description: "MouvStock is an inventory management system created with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <Sidebar>
          <SidebarItem icon={<Home />} text="Home" href="/home" />
          <SidebarItem icon={<Package />} text="Stock" href="/stock" />
          <SidebarItem icon={<Search />} text="Produits" href="/products" />
          <SidebarItem icon={<ScanBarcode />} text="Caisse" href="/pointOfSale" />
          <SidebarItem icon={<ArrowRight />} text="Arrivé de stock" href="/stockArrival" />
          <SidebarItem icon={<Settings />} text="Settings" href="/settings" />

          {/* Ajoutez d'autres éléments de la barre latérale ici */}
        </Sidebar>
        <main className="flex-1 bg-gray-200 p-6">
          {children}
        </main>

      </body>
    </html>
  );
}
