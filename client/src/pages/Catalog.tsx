import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import type { Product } from "@shared/schema";

export default function Catalog() {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: "all",
    sizes: [] as string[],
  });
  const [sortBy, setSortBy] = useState("featured");

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Apply price range filter
    if (filters.priceRange !== "all") {
      const price = parseFloat(filtered[0]?.price || "0");
      switch (filters.priceRange) {
        case "0-50":
          filtered = filtered.filter(product => parseFloat(product.price) < 50);
          break;
        case "50-100":
          filtered = filtered.filter(product => {
            const price = parseFloat(product.price);
            return price >= 50 && price <= 100;
          });
          break;
        case "100+":
          filtered = filtered.filter(product => parseFloat(product.price) > 100);
          break;
      }
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        filters.sizes.some(size => product.sizes.includes(size))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
        break;
      default:
        // Keep original order for "featured"
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-black mb-4">Complete Collection</h1>
            <p className="text-xl text-gray-600">Browse our full range of premium menswear</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-1/4">
              <FilterSidebar onFilterChange={setFilters} />
            </div>

            {/* Product Grid */}
            <div className="lg:w-3/4">
              {/* Sort and View Options */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-gray-600" data-testid="text-product-count">
                  Showing {filteredAndSortedProducts.length} of {products?.length || 0} products
                </p>
                <div className="flex items-center space-x-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48" data-testid="select-sort">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center text-red-600 py-12">
                  <p>Failed to load products. Please try again later.</p>
                </div>
              )}

              {!isLoading && !error && filteredAndSortedProducts.length === 0 && (
                <div className="text-center text-gray-600 py-12">
                  <p>No products found matching your filters.</p>
                </div>
              )}

              {!isLoading && !error && filteredAndSortedProducts.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination would go here if needed */}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
