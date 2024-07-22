"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectBrand } from "./SelectBrand";
import { SelectCategory } from "./SelectCategory";

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

interface DataTableProps<TData extends Product> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
}

export function DataTable<TData extends Product>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [tableData, setTableData] = React.useState<TData[]>(data);
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  const router = useRouter();

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${searchValue}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const product: TData = await response.json();
      setTableData([product]);
    } catch (error) {
      console.error("Error fetching product:", error);
      setTableData([]); // Clear the table data on error
    }
  };

  const handleFetchLowStockProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products?state=Faible`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const products: TData[] = await response.json();
      setTableData(products);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      setTableData([]); // Clear the table data on error
    }
  };

  const handleBrandSelect = async (brand: string) => {
    setSelectedBrand(brand);
    setSelectedCategory(""); // Clear selected category when brand changes

    if (brand) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/products?brand=${brand}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const products: TData[] = await response.json();
        if (products.length === 0) {
          setTableData([]); // Clear the table data if no products are returned
        } else {
          setTableData(products);
        }
      } catch (error) {
        console.error("Error fetching products by brand:", error);
        setTableData([]); // Clear the table data on error
      }
    } else {
      setTableData([]); // Clear the table data if no brand is selected
    }
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setSelectedBrand(""); // Clear selected brand when category changes

    if (category) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/products?category=${category}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const products: TData[] = await response.json();
        if (products.length === 0) {
          setTableData([]); // Clear the table data if no products are returned
        } else {
          setTableData(products);
        }
      } catch (error) {
        console.error("Error fetching products by category:", error);
        setTableData([]); // Clear the table data on error
      }
    } else {
      setTableData([]); // Clear the table data if no category is selected
    }
  };

  const handleRowClick = (barecode: string) => {
    router.push(`/products/productDetails?barecode=${barecode}`);
  };

  return (
    <>
      <div className="flex items-center py-4 gap-4"> {/* Ajout de gap-4 pour espacer les boutons */}
        <Input
          placeholder="Rechercher un article..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSearch} className="rounded-lg">Rechercher</Button>
        <Button 
          onClick={handleFetchLowStockProducts}
          className="rounded-lg bg-yellow-300 text-black hover:bg-yellow-400"
        >
          Stock faible
        </Button>
        <SelectBrand onBrandSelect={handleBrandSelect} />
        <SelectCategory onCategorySelect={handleCategorySelect} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original.barecode)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
