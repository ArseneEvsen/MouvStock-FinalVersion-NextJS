"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BatchProduct {
  barecode: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  productId: string;
}

interface BatchProductPageProps {
  batchProduct: BatchProduct;
}

const BatchProductDetails: React.FC<BatchProductPageProps> = ({ batchProduct }) => {
  const basePath = '/assets/';
  const imageUrl = `${basePath}${batchProduct.image}`;
  const router = useRouter();

  const [activeImg] = useState(imageUrl);
  const [quantity, setQuantity] = useState<number>(batchProduct.quantity);
  const [price, setPrice] = useState<number>(batchProduct.price);
  const [name, setName] = useState<string>(batchProduct.name);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(0, prev + change));
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(event.target.value));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleModifyBatchProduct = async () => {
    const response = await fetch(`http://localhost:3000/api/batchProducts/${batchProduct.barecode}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        quantity: quantity,
        price: price.toString(),
        image: batchProduct.image,
      }),
    });

    if (!response.ok) {
      console.error('Failed to update batchProduct');
    } else {
      console.log('BatchProduct updated successfully');
    }
  };

  const handleRedirect = () => {
    router.push(`/productDetails?barecode=${batchProduct.productId}`);
  };

  return (
    <div className='flex flex-col justify-between lg:flex-row gap-16 lg:items-center'>
      <div className='flex flex-col gap-6 lg:w-2/4'>
        <img
          src={activeImg}
          alt={batchProduct.name}
          className='w-[500px] h-[500px] object-cover rounded-xl'
        />
      </div>
      <div className='flex flex-col gap-4 lg:w-2/4'>
        <div>
          <h1 className='text-3xl font-bold'>{batchProduct.name}</h1>
          <input
            type='text'
            value={name}
            onChange={handleNameChange}
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
          <span className='font-semibold'>Produit unitaire associé à ce lot :</span>
          <span className='ml-2 p-1 border rounded'>{batchProduct.productId}</span>
          <button
            className='bg-gray-500 text-white font-semibold py-1 px-4 rounded-xl ml-2'
            onClick={handleRedirect}
          >
            Voir le produit
          </button>
        </div>
        <div>
          <span className='font-semibold'>Quantité du lot :</span>
          <div className='flex flex-row items-center gap-4'>
            <button
              className='bg-gray-200 py-2 px-5 rounded-lg text-blue-800 text-3xl'
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span className='py-4 px-6 rounded-lg'>{quantity}</span>
            <button
              className='bg-gray-200 py-2 px-4 rounded-lg text-blue-800 text-3xl'
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
        </div>
        <button
          className='bg-blue-800 text-white font-semibold py-3 px-16 rounded-xl mt-4'
          onClick={handleModifyBatchProduct}
        >
          Modifier
        </button>
      </div>
    </div>
  );
};

export default BatchProductDetails;
