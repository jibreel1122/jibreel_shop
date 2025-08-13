import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCart } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Minus, Plus, ChevronDown, Heart, ArrowLeft } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/catalog">Browse Catalog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8">
          <Link href="/catalog">
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" data-testid="button-back-catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden bg-gray-50 rounded-lg">
              <img
                src={product.images[selectedImageIndex]}
                alt={`${product.name} - Main View`}
                className="w-full h-full object-cover"
                data-testid="img-main-product"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden bg-gray-50 rounded cursor-pointer border-2 transition-colors ${
                    selectedImageIndex === index ? "border-blue-600" : "border-transparent hover:border-blue-600"
                  }`}
                  data-testid={`button-thumbnail-${index}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2" data-testid="text-product-name">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600" data-testid="text-product-category">
                {product.category}
              </p>
            </div>

            <div className="text-3xl font-bold text-black" data-testid="text-product-price">
              ${parseFloat(product.price).toFixed(2)}
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed" data-testid="text-product-description">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedSize === size
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

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedColor === color
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:border-blue-600 hover:text-blue-600"
                    }`}
                    data-testid={`button-color-${color}`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2"
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2"
                  data-testid="button-increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="flex-1 bg-black text-white hover:bg-gray-800"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || product.stock === 0}
                data-testid="button-add-to-cart"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button variant="outline" size="icon" data-testid="button-add-wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Stock Status */}
            {(product.stock ?? 0) > 0 && (product.stock ?? 0) < 10 && (
              <Badge variant="secondary" className="text-sm">
                Only {product.stock} left in stock
              </Badge>
            )}

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <Collapsible>
                <CollapsibleTrigger className="flex justify-between items-center w-full text-left" data-testid="button-toggle-details">
                  <span className="text-sm font-medium text-gray-900">Product Details</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 text-sm text-gray-600">
                  <ul className="space-y-1">
                    <li>• Premium materials and construction</li>
                    <li>• Machine washable</li>
                    <li>• Available in multiple sizes and colors</li>
                    <li>• Modern fit design</li>
                  </ul>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex justify-between items-center w-full text-left" data-testid="button-toggle-shipping">
                  <span className="text-sm font-medium text-gray-900">Shipping & Returns</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 text-sm text-gray-600">
                  <p>Free shipping on orders over $75. 30-day return policy. See our full shipping and returns policy for details.</p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
