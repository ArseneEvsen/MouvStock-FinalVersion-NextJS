"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BatchProductFormData {
  barecode: string;
  name: string;
  productId: string;
  quantity: number;
  price: string;
  image?: File | null;
}

const CreateBatchProductPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<BatchProductFormData>({
    barecode: '',
    name: '',
    productId: '',
    quantity: 0,
    price: '',
    image: null,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) :
               name === 'price' ? value : // Keep price as string
               value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate the form data
    if (!formData.barecode || !formData.name || !formData.productId || !formData.price || formData.quantity < 0) {
      setError('Tous les champs obligatoires (code-barres, nom, identifiant du produit, prix, quantité) doivent être remplis.');
      return;
    }

    if (formData.quantity < 0 || parseFloat(formData.price) < 0) {
      setError('La quantité et le prix ne peuvent pas être des valeurs négatives.');
      return;
    }

    // Prepare the JSON payload
    const payload: any = {
      barecode: formData.barecode,
      name: formData.name,
      productId: formData.productId,
      quantity: formData.quantity,
      price: parseFloat(formData.price).toFixed(2), // Convert price to string with two decimal places
    };

    // Handle file separately if there's an image
    const formDataToSend = new FormData();
    formDataToSend.append('payload', JSON.stringify(payload));
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
        console.log(payload);
      const response = await fetch('http://localhost:3000/api/batchProducts', options);
      if (!response.ok) {
        throw new Error('Erreur lors de la création du produit en lot.');
      }
      router.push('/products');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création du produit en lot.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Créer un Produit en Lot</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="barecode" className="block font-semibold mb-1">Code-barre</label>
            <input
              type="text"
              id="barecode"
              name="barecode"
              value={formData.barecode}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block font-semibold mb-1">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="productId" className="block font-semibold mb-1">Code-barre du produit unitaire associé</label>
            <input
              type="text"
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block font-semibold mb-1">Quantité</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block font-semibold mb-1">Prix</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block font-semibold mb-1">Image (optionnel)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition-colors duration-300"
          >
            Créer le produit en lot
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBatchProductPage;
