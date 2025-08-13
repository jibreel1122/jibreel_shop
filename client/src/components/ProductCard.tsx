import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAuthenticated && product.sizes.length > 0 && product.colors.length > 0) {
      addItem({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images[0],
        size: product.sizes[0],
        color: product.colors[0],
        quantity: 1,
      });
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className={`group cursor-pointer hover:shadow-md transition-shadow ${className}`} data-testid={`card-product-${product.id}`}>
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isAuthenticated && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <Button
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black hover:bg-gray-100"
                onClick={handleQuickAdd}
                data-testid={`button-quick-add-${product.id}`}
              >
                Quick Add
              </Button>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-black mb-1" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2" data-testid={`text-product-category-${product.id}`}>
            {product.category}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-black" data-testid={`text-product-price-${product.id}`}>
              ${parseFloat(product.price).toFixed(2)}
            </p>
            {(product.stock ?? 0) < 10 && (product.stock ?? 0) > 0 && (
              <Badge variant="secondary" className="text-xs">
                Low Stock
              </Badge>
            )}
            {(product.stock ?? 0) === 0 && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
