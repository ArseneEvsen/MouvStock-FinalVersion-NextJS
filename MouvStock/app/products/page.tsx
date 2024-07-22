// File: app/products/page.tsx

import React from 'react';
import Link from 'next/link';

const ProductsPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Menu "Rechercher un produit" */}
        <Link 
          href="/products/productResearch" 
          className="flex justify-center items-center p-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold">Rechercher un produit</h2>
            <p className="mt-2">Trouvez rapidement des produits dans votre catalogue.</p>
          </div>
        </Link>

        {/* Menu "Créer un produit" */}
        <Link 
          href="/products/create" 
          className="flex justify-center items-center p-6 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold">Créer un produit</h2>
            <p className="mt-2">Ajoutez un nouveau produit à votre catalogue.</p>
          </div>
        </Link>

        {/* Menu "Créer une marque" */}
        <Link 
          href="/products/create/brands" 
          className="flex justify-center items-center p-6 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-colors duration-300"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold">Créer une Marque</h2>
            <p className="mt-2">Ajoutez une nouvelle marque à votre catalogue.</p>
          </div>
        </Link>

        {/* Menu "Créer une catégorie" */}
        <Link 
          href="/products/create/categories" 
          className="flex justify-center items-center p-6 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors duration-300"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold">Créer une Catégorie</h2>
            <p className="mt-2">Ajoutez une nouvelle catégorie à votre catalogue.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductsPage;
