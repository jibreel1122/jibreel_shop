import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, ShoppingBag, User, Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { items } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/catalog" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold text-black hover:text-blue-600 transition-colors" data-testid="logo">
                ModernWear
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location === item.href
                        ? "text-black"
                        : "text-gray-600 hover:text-black"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            {isAuthenticated && (
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative" data-testid="button-cart">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-blue-600">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-user-menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <a href="/api/logout">Logout</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" data-testid="button-login">
                <a href="/api/login">Login</a>
              </Button>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <span
                        className={`block px-3 py-2 text-base font-medium transition-colors ${
                          location === item.href
                            ? "text-black border-l-4 border-blue-600 bg-gray-50"
                            : "text-gray-600 hover:text-black hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <>
                      <Link href="/dashboard">
                        <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50">
                          Dashboard
                        </span>
                      </Link>
                      {user?.isAdmin && (
                        <Link href="/admin">
                          <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50">
                            Admin
                          </span>
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full max-w-md"
              autoFocus
              data-testid="input-search"
            />
          </div>
        )}
      </nav>
    </header>
  );
}
