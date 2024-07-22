"use client";

import React, { useState, useEffect, useRef } from 'react';
import ProductDetailsLight from "./ProductDetailLight";
import BatchProductDetailsLight from "./BatchProductLight";

const PointOfSale: React.FC = () => {
  const [barcode, setBarcode] = useState<string>('');
  const [product, setProduct] = useState<any | null>(null);
  const [batchProduct, setBatchProduct] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const validateBarcode = async (barcode: string) => {
      setError(null);
      setProduct(null);
      setBatchProduct(null);

      try {
        let response = await fetch(`http://localhost:3000/api/products/${barcode}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          await createSaleEntry(data.barecode, 1, data.price.toFixed(2));
          await updateProductStock(data.barecode, data.stock - 1);
        } else {
          response = await fetch(`http://localhost:3000/api/batchProducts/${barcode}`);
          if (response.ok) {
            const data = await response.json();
            setBatchProduct(data);
            await createSaleEntry(data.productId, data.quantity, data.price.toFixed(2));
            const productResponse = await fetch(`http://localhost:3000/api/products/${data.productId}`);
            const productData = await productResponse.json();
            await updateProductStock(data.productId, productData.stock - data.quantity);
          } else {
            setError('Produit ou BatchProduct non trouvé');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la validation du code-barres.');
      } finally {
        resetSearchInput();
      }
    };

    if (barcode.length > 0) {
      if (timeoutId) clearTimeout(timeoutId);
      const id = setTimeout(() => validateBarcode(barcode), 1000);
      setTimeoutId(id);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [barcode]);

  const resetSearchInput = () => {
    setBarcode('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      searchInputRef.current.focus();
    }
  };

  const createSaleEntry = async (productId: string, quantity: number, price: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, price }),
      });
      if (!response.ok) throw new Error('Erreur lors de la création de la vente.');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création de la vente.');
    }
  };

  const updateProductStock = async (barcode: string, newStock: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${barcode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du stock.');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour du stock.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Point de Vente</h1>
          <input
            type="text"
            ref={searchInputRef}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Scannez ou entrez le code-barres"
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {product && <ProductDetailsLight product={product} />}
        {batchProduct && <BatchProductDetailsLight batchProduct={batchProduct} />}
      </div>
    </div>
  );
};

export default PointOfSale;
