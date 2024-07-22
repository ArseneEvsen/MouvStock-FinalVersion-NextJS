"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductDetails from './ProductDetails';
import BatchProductDetails from './BatchProductDetails';
import { MenuPeriod } from './MenuPeriod';
import { ProductChart } from './ProductChart';

interface Product {
  barecode: string;
  name: string;
  brandName: string;
  categoryName: string;
  price: number;
  stock: number;
  stockLimit: number;
  image: string;
  state: string;
}

interface BatchProduct {
  barecode: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  productId: string;
}

interface Sale {
  productId: string;
  quantity: number;
  date: string;
  price: number;
}

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [batchProduct, setBatchProduct] = useState<BatchProduct | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [barecodeInput, setBarecodeInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('weekly');

  const searchParams = useSearchParams();
  const barecode = searchParams.get('barecode');

  useEffect(() => {
    if (barecode) {
      setBarecodeInput(barecode);
      handleSearch(barecode);
    }
  }, [barecode]);

  useEffect(() => {
    if (product) {
      fetchSales(product.barecode, selectedPeriod);
    } else if (batchProduct) {
      fetchSales(batchProduct.productId, selectedPeriod);
    }
  }, [selectedPeriod, product, batchProduct]);

  const handleSearch = async (input: string) => {
    setLoading(true);
    setError(null);
    setProduct(null);
    setBatchProduct(null);
    setSales([]);

    try {
      let response = await fetch(`http://localhost:3000/api/products/${input}`);
      if (!response.ok) {
        response = await fetch(`http://localhost:3000/api/batchProducts/${input}`);
        if (!response.ok) {
          throw new Error('Produit ou BatchProduct non trouvé');
        }
        const batchProductData: BatchProduct = await response.json();
        setBatchProduct(batchProductData);
        await fetchSales(batchProductData.productId, selectedPeriod);
      } else {
        const productData: Product = await response.json();
        setProduct(productData);
        await fetchSales(productData.barecode, selectedPeriod);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async (productId: string, period: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/sales?productId=${productId}&period=${period}`);
      if (!response.ok) {
        throw new Error('Ventes non trouvées');
      }
      const salesData: Sale[] = await response.json();
      setSales(salesData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  const handleButtonClick = () => {
    if (barecodeInput) {
      handleSearch(barecodeInput);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex flex-row gap-4">
            <input
              type="text"
              value={barecodeInput}
              onChange={(e) => setBarecodeInput(e.target.value)}
              placeholder="Entrez le code-barres du produit"
              className="p-2 border border-gray-300 rounded-lg w-80"
            />
            <button
              onClick={handleButtonClick}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Rechercher
            </button>
          </div>
        </div>

        {loading && <p className="text-blue-500">Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {product && <ProductDetails product={product} />}
        {batchProduct && <BatchProductDetails batchProduct={batchProduct} />}
      </div>

      {(product || batchProduct) && (
        <div className="w-full max-w-4xl mt-8">
          <MenuPeriod onSelectPeriod={setSelectedPeriod} />
          <ProductChart period={selectedPeriod} sales={sales} />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
