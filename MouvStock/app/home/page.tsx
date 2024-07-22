// File: app/home/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { MenuPeriod } from './MenuPeriod'; // Assurez-vous que le chemin est correct
import { SalesCharts } from './SalesCharts'; // Assurez-vous que le chemin est correct
import InfoCard from './InfoCard'; // Assurez-vous que le chemin est correct
import { Package, Euro } from 'lucide-react';

interface Sale {
  productId: string;
  quantity: number;
  date: string;
  price: number;
}

const HomePage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [dailyProfit, setDailyProfit] = useState<number>(0); // Ajout pour les profits journaliers
  const [selectedPeriod, setSelectedPeriod] = useState<string>('weekly');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);

      try {
        const response = await fetch(`http://localhost:3000/api/sales?period=${selectedPeriod}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des ventes');
        }
        const salesData: Sale[] = await response.json();
        setSales(salesData);

        // Calculer le profit généré aujourd'hui
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        const todaySales = salesData.filter(sale => sale.date.startsWith(today));
        const totalProfit = todaySales.reduce((acc, sale) => acc + sale.price, 0);
        setDailyProfit(totalProfit);
      } catch {
        // Ne pas mettre à jour les erreurs pour l'API des ventes
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [selectedPeriod]);

  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products?state=Faible');
        if (!response.ok) {
          // Assurez-vous que l'API retourne une erreur pour les stocks faibles
          throw new Error('Erreur lors de la récupération des produits avec stock faible');
        }
        const products = await response.json();
        setLowStockCount(products.length);
      } catch {
        // Si une erreur se produit, définir lowStockCount à 0
        setLowStockCount(0);
      }
    };

    fetchLowStockCount();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Résumé du Stock et des Ventes</h1>
      
      <div className="w-full max-w-4xl mx-auto mb-8">
        <MenuPeriod onSelectPeriod={setSelectedPeriod} />
      </div>

      {loading ? (
        <p className="text-blue-500 text-center">Chargement...</p>
      ) : (
        <div className="w-full max-w-4xl mx-auto mb-8">
          <SalesCharts period={selectedPeriod} sales={sales} />
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-8">
        <InfoCard
          color="bg-red-500"
          number={lowStockCount}
          description="Produits avec stock faible"
          icon={<Package size={64} />}
        />
        <InfoCard
          color="bg-blue-500"
          number={dailyProfit}
          description="Profit généré aujourd'hui"
          icon={<Euro size={64} />}
        />
      </div>
    </div>
  );
};

export default HomePage;
