import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  onFilterChange: (filters: {
    categories: string[];
    priceRange: string;
    sizes: string[];
  }) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const categories = [
    "Tops",
    "Bottoms", 
    "Outerwear",
    "Essentials",
    "Formal",
    "Athleisure",
    "Knitwear",
    "Denim"
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-50", label: "Under $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100+", label: "Over $100" },
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    
    setSelectedCategories(newCategories);
    onFilterChange({
      categories: newCategories,
      priceRange: selectedPriceRange,
      sizes: selectedSizes,
    });
  };

  const handlePriceRangeChange = (value: string) => {
    setSelectedPriceRange(value);
    onFilterChange({
      categories: selectedCategories,
      priceRange: value,
      sizes: selectedSizes,
    });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    
    setSelectedSizes(newSizes);
    onFilterChange({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      sizes: newSizes,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange("all");
    setSelectedSizes([]);
    onFilterChange({
      categories: [],
      priceRange: "all",
      sizes: [],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Filters</span>
          <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  data-testid={`checkbox-category-${category.toLowerCase()}`}
                />
                <Label htmlFor={`category-${category}`} className="text-sm text-gray-600">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
          <RadioGroup value={selectedPriceRange} onValueChange={handlePriceRangeChange}>
            {priceRanges.map((range) => (
              <div key={range.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={range.value} 
                  id={`price-${range.value}`}
                  data-testid={`radio-price-${range.value}`}
                />
                <Label htmlFor={`price-${range.value}`} className="text-sm text-gray-600">
                  {range.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Size Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Size</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-1 text-sm ${
                  selectedSizes.includes(size)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:border-blue-600 hover:text-blue-600"
                }`}
                data-testid={`button-size-${size}`}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
