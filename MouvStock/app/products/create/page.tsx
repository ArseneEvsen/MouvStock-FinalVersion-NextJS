"use client";

import { useRouter } from 'next/navigation';

const CreateProductPage = () => {
  const router = useRouter();

  const handleSelectProductType = (type: 'unit' | 'batch') => {
    if (type === 'unit') {
      router.push('/products/create/unitProduct');
    } else if (type === 'batch') {
      router.push('/products/create/batchProducts');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Quel type de produit souhaitez-vous créer ?</h1>
      <div className="flex flex-row space-x-8 mb-8">
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => handleSelectProductType('unit')}
        >
          <img 
            src="http://localhost:3000/assets/water.png" 
            alt="Produit Unitaire" 
            className="w-64 h-64 object-cover rounded-lg mb-4 shadow-lg"
          />
          <span className="text-xl font-semibold">Produit Unitaire</span>
        </div>
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => handleSelectProductType('batch')}
        >
          <img 
            src="http://localhost:3000/assets/waterBatch.png" 
            alt="Produit en Lot" 
            className="w-64 h-64 object-cover rounded-lg mb-4 shadow-lg"
          />
          <span className="text-xl font-semibold">Produits en Lot</span>
        </div>
      </div>
      <div className="bg-yellow-200 border-l-4 border-yellow-600 text-yellow-800 p-4 rounded-lg shadow-md w-full max-w-2xl">
        <p className="font-bold">Important :</p>
        <p>La différence est qu'un <span className='font-bold'>produit unitaire</span> ne peut pas être divisé, alors que des <span className='font-bold'>produits en lot</span> peuvent être divisés en plusieurs produits unitaires.</p>
      </div>
    </div>
  );
};

export default CreateProductPage;
