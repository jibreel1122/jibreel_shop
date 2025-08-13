import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart();

  const total = getTotal();
  const itemCount = getItemCount();
  const tax = total * 0.08; // 8% tax
  const grandTotal = total + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild className="bg-black text-white hover:bg-gray-800" data-testid="button-continue-shopping">
              <Link href="/catalog">Continue Shopping</Link>
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8">
          <Link href="/catalog">
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" data-testid="button-back-catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Shopping Cart</h1>
          <p className="text-xl text-gray-600">Review your selected items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Items ({itemCount})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                          data-testid={`img-cart-item-${index}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black" data-testid={`text-item-name-${index}`}>
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm" data-testid={`text-item-variant-${index}`}>
                          {item.color}, Size {item.size}
                        </p>
                        <p className="text-lg font-bold text-black mt-1" data-testid={`text-item-price-${index}`}>
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${index}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center py-1 border border-gray-300 rounded" data-testid={`text-item-quantity-${index}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          data-testid={`button-increase-${index}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-black" data-testid={`text-item-total-${index}`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700 mt-1"
                          data-testid={`button-remove-${index}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900" data-testid="text-subtotal">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900" data-testid="text-tax">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span data-testid="text-grand-total">${grandTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <Button asChild className="w-full bg-black text-white hover:bg-gray-800" data-testid="button-checkout">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" data-testid="button-continue-shopping-summary">
                    <Link href="/catalog">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
