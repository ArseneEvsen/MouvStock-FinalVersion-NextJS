"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFormData {
  barecode: string;
  name: string;
  brandName: string;
  categoryName: string;
  price: number;
  stock?: number;
  stockLimit?: number;
  image?: File | null;
}

const CreateUnitProductPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    barecode: '',
    name: '',
    brandName: '',
    categoryName: '',
    price: 0,
    stock: 0,
    stockLimit: 20,
    image: null,
  });
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch brands and categories
    const fetchBrands = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/brands');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des marques.');
        }
        const data = await response.json();
        const brandNames = data.map((brand: { name: string }) => brand.name);
        setBrands(brandNames);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des marques.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categories');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories.');
        }
        const data = await response.json();
        const categoryNames = data.map((category: { name: string }) => category.name);
        setCategories(categoryNames);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des catégories.');
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) :
               name === 'stock' || name === 'stockLimit' ? parseInt(value, 10) :
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
    if (!formData.barecode || !formData.name || !formData.brandName || !formData.categoryName || formData.price < 0) {
      setError('Tous les champs obligatoires (code-barres, nom, marque, catégorie, prix) doivent être remplis.');
      return;
    }

    if (formData.price < 0 || (formData.stock && formData.stock < 0) || (formData.stockLimit && formData.stockLimit < 0)) {
      setError('Le prix, le stock et la limite de stock ne peuvent pas être des valeurs négatives.');
      return;
    }

    // Prepare the JSON payload
    const payload: any = {
      barecode: formData.barecode,
      name: formData.name,
      brandName: formData.brandName,
      categoryName: formData.categoryName,
      price: formData.price.toFixed(2), // Convert to string with two decimal places
    };

    // Only include stock and stockLimit if they are not undefined
    if (formData.stock !== undefined) {
      payload.stock = formData.stock;
    }
    if (formData.stockLimit !== undefined) {
      payload.stockLimit = formData.stockLimit;
    }

    // Handle file separately if there's an image
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch('http://localhost:3000/api/products', options);
      if (!response.ok) {
        throw new Error('Erreur lors de la création du produit.');
      }
      router.push('/products');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création du produit.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Créer un Produit Unitaire</h1>
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
            <label htmlFor="brandName" className="block font-semibold mb-1">Marque</label>
            <select
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            >
              <option value="" disabled>Choisissez une marque</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="categoryName" className="block font-semibold mb-1">Catégorie</label>
            <select
              id="categoryName"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            >
              <option value="" disabled>Choisissez une catégorie</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block font-semibold mb-1">Prix</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block font-semibold mb-1">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock || ''}
              onChange={handleChange}
              min="0"
              className="p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>

          <div>
            <label htmlFor="stockLimit" className="block font-semibold mb-1">Limite de Stock</label>
            <input
              type="number"
              id="stockLimit"
              name="stockLimit"
              value={formData.stockLimit || ''}
              onChange={handleChange}
              min="0"
              className="p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>

          <div>
            <label htmlFor="image" className="block font-semibold mb-1">Image</label>
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
            Créer le produit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUnitProductPage;
