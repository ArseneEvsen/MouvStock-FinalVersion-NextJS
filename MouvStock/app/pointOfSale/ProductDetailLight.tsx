"use client";

import React from 'react';

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
    const basePath = '/assets/'; // Chemin de base fixe pour les images

    // Construire l'URL complète pour l'image
    const imageUrl = `${basePath}${product.image}`;

    return (
        <div className='flex flex-col justify-between lg:flex-row gap-16 lg:items-center'>
            <div className='flex flex-col gap-6 lg:w-2/4'>
                <img
                    src={imageUrl}
                    alt={product.name}
                    className='w-[500px] h-[500px] object-cover rounded-xl' // Taille fixe pour l'image principale
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
                    <span className='font-semibold'>État du stock :</span>
                    <span className='text-gray-700'> {product.state}</span>
                </div>
                <div>
                    <span className='font-semibold'>Stock :</span>
                    <span className='text-gray-700'> {product.stock}</span>
                </div>
                <div>
                    <span className='font-semibold'>Limite de stock avant alerte :</span>
                    <span className='text-gray-700'> {product.stockLimit}</span>
                </div>
                <div>
                    <span className='font-semibold'>Prix :</span>
                    <span className='text-gray-700'> {product.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
