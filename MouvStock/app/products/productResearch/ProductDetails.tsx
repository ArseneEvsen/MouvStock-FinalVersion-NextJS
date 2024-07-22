"use client";
import React, { useState } from 'react';

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

interface ProductPageProps {
  product: Product;
}

const ProductDetails: React.FC<ProductPageProps> = ({ product }) => {
  const basePath = '/assets/';
  const imageUrl = `${basePath}${product.image}`;

  const [activeImg] = useState(imageUrl);
  const [amount, setAmount] = useState<number>(product.stock);
  const [price, setPrice] = useState<number>(product.price);
  const [stockLimit, setStockLimit] = useState<number>(product.stockLimit);

  const handleAmountChange = (change: number) => {
    setAmount(prev => {
      const newAmount = prev + change;
      return Math.max(0, newAmount);
    });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(event.target.value));
  };

  const handleStockLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStockLimit(parseInt(event.target.value, 10));
  };

  const handleModifyProduct = async () => {
    const response = await fetch(`http://localhost:3000/api/products/${product.barecode}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock: amount,
        price: price.toString(),
        stockLimit: stockLimit
      }),
    });

    if (!response.ok) {
      console.error('Failed to update product');
    } else {
      console.log('Product updated successfully');
    }
  };

  return (
    <div className='flex flex-col justify-between lg:flex-row gap-16 lg:items-center'>
      <div className='flex flex-col gap-6 lg:w-2/4'>
        <img
          src={activeImg}
          alt={product.name}
          className='w-[500px] h-[500px] object-cover rounded-xl'
        />
      </div>
      <div className='flex flex-col gap-4 lg:w-2/4'>
        <div>
          <span className='text-blue-600 font-semibold'>{product.brandName}</span>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
        </div>
        <div>
          <span className='font-semibold'>Catégorie :</span>
          <span className='text-gray-700'> {product.categoryName}</span>
        </div>
        <div>
          <span className='font-semibold'>Etat du stock :</span>
          <span className='text-gray-700'> {product.state}</span>
        </div>
        <div>
          <span className='font-semibold'>Limite de stock avant alerte :</span>
          <input
            type='number'
            value={stockLimit}
            onChange={handleStockLimitChange}
            className='ml-2 p-1 border rounded'
          />
        </div>
        <div>
          <span className='font-semibold'>Prix :</span>
          <input
            type='number'
            value={price}
            onChange={handlePriceChange}
            step='0.01'
            className='ml-2 p-1 border rounded'
          />
        </div>
        <div>
          <span className='font-semibold'>Quantité en stock :</span>
          <div className='flex flex-row items-center gap-4'>
            <button
              className='bg-gray-200 py-2 px-5 rounded-lg text-blue-800 text-3xl'
              onClick={() => handleAmountChange(-1)}
            >
              -
            </button>
            <span className='py-4 px-6 rounded-lg'>{amount}</span>
            <button
              className='bg-gray-200 py-2 px-4 rounded-lg text-blue-800 text-3xl'
              onClick={() => handleAmountChange(1)}
            >
              +
            </button>
          </div>
        </div>
        <button
          className='bg-blue-800 text-white font-semibold py-3 px-16 rounded-xl mt-4'
          onClick={handleModifyProduct}
        >
          Modifier
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
