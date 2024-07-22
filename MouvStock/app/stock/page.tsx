"use client"
import { Product, columns } from "./columns";
import { DataTable } from "./data-table";
import * as React from "react";

async function getInitialData(): Promise<Product[]> {
  try {
    const response = await fetch(
      "http://localhost:3000/api/products?state=Faible",
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Product[] = await response.json();

    // Check if data is empty, if yes, return an empty array
    if (data.length === 0) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching products with state=Faible:", error);
    return []; // Return an empty array in case of error
  }
}

export default function DemoPage() {
  const [initialData, setInitialData] = React.useState<Product[]>([]);

  React.useEffect(() => {
    getInitialData().then((data) => setInitialData(data));
  }, []);

  return (
    <div className="container mx-auto py-10">
    <h1>Recherche d'articles :</h1>
    <DataTable columns={columns} data={initialData} />

  </div>
  );
}
