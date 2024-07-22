"use client";

import React, { useState } from 'react';

interface CategoryFormData {
  name: string;
}

const CreateCategoryPage: React.FC = () => {
  const [formData, setFormData] = useState<CategoryFormData>({ name: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validate the form data
    if (!formData.name) {
      setError('Le nom de la catégorie est requis.');
      return;
    }

    // Prepare the JSON payload
    const payload: CategoryFormData = {
      name: formData.name,
    };

    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch('http://localhost:3000/api/categories', options);
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la catégorie.');
      }
      setMessage('La catégorie a été créée avec succès.');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création de la catégorie.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Créer une Catégorie</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">Nom de la Catégorie</label>
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

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition-colors duration-300"
          >
            Créer la catégorie
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryPage;
