// SelectCategory.tsx
import * as React from "react";

interface SelectCategoryProps {
  onCategorySelect: (category: string) => void;
}

export const SelectCategory: React.FC<SelectCategoryProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = React.useState<{ name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories", { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <select value={selectedCategory} onChange={handleChange}>
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.name} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
  );
};
