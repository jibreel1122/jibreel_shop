import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-50">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1380"
            alt="Modern men's fashion collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Redefine Your Style
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Discover our curated collection of premium men's fashion. Minimalist design meets exceptional quality.
          </p>
          <div className="space-x-4">
            <Button 
              asChild 
              className="bg-white text-black px-8 py-3 text-lg font-semibold hover:bg-gray-100"
              data-testid="button-shop-collection"
            >
              <Link href="/catalog">Shop Collection</Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white px-8 py-3 text-lg font-semibold hover:bg-white hover:text-black"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Featured Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked essentials that define modern masculine style
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
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
          <div className="text-center text-red-600">
            <p>Failed to load featured products. Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && featuredProducts.length === 0 && (
          <div className="text-center text-gray-600">
            <p>No featured products available at the moment.</p>
          </div>
        )}

        {!isLoading && !error && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild className="bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-800" data-testid="button-view-all">
            <Link href="/catalog">View All Products</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
