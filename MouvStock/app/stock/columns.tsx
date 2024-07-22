"use client"

import { ColumnDef } from "@tanstack/react-table"

// Définir le type Product
export type Product = {
  barecode: string;
  name: string;
  brandName: string;
  categoryName: string;
  price: number;
  stock: number;
  stockLimit: number;
  image: string;
  state: 'Faible' | 'Normal';
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = `/assets/${row.getValue("image")}`; // Construit l'URL de l'image
      return (
        <img
          src={imageUrl}
          alt="Product Image"
          className="w-16 h-16 object-cover" // Fixer la taille de l'image
        />
      );
    },
  },
  {
    accessorKey: "barecode",
    header: "Codebarre",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "brandName",
    header: "Marque",
  },
  {
    accessorKey: "categoryName",
    header: "Catégorie",
  },
  {
    accessorKey: "price",
    header: "Prix",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "state",
    header: "État",
  },
]
