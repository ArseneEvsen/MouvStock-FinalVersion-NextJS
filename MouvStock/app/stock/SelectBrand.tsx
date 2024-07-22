import * as React from "react";

interface SelectBrandProps {
  onBrandSelect: (brand: string) => void;
}

export const SelectBrand: React.FC<SelectBrandProps> = ({ onBrandSelect }) => {
  const [brands, setBrands] = React.useState<{ name: string }[]>([]);
  const [selectedBrand, setSelectedBrand] = React.useState("");

  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/brands", { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const brandsData = await response.json();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    onBrandSelect(brand);
  };

  return (
    <select value={selectedBrand} onChange={handleChange}>
      <option value="">Select a brand</option>
      {brands.map((brand) => (
        <option key={brand.name} value={brand.name}>
          {brand.name}
        </option>
      ))}
    </select>
  );
};
