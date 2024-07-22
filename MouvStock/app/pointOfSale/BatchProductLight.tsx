"use client";

import React from 'react';

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
  const basePath = '/assets/'; // Chemin de base fixe pour les images

  // Construire l'URL complète pour l'image
  const imageUrl = `${basePath}${batchProduct.image}`;

  return (
    <div className='flex flex-col justify-between lg:flex-row gap-16 lg:items-center'>
      <div className='flex flex-col gap-6 lg:w-2/4'>
        <img
          src={imageUrl}
          alt={batchProduct.name}
          className='w-[500px] h-[500px] object-cover rounded-xl'
        />
      </div>
      <div className='flex flex-col gap-4 lg:w-2/4'>
        <div>
          <h1 className='text-3xl font-bold'>{batchProduct.name}</h1>
        </div>
        <div>
          <span className='font-semibold'>Prix :</span>
          <span className='ml-2 p-1 border rounded'>{batchProduct.price.toFixed(2)}</span>
        </div>
        <div>
          <span className='font-semibold'>Produit unitaire associé à ce lot :</span>
          <span className='ml-2 p-1 border rounded'>{batchProduct.productId}</span>
        </div>
        <div className='flex flex-row items-center gap-12'>
          <span className='font-semibold'>Quantité du lot :</span>
          <span className='py-4 px-6 rounded-lg'>{batchProduct.quantity}</span>
        </div>
      </div>
    </div>
  );
};

export default BatchProductDetails;
