import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertProductSchema, insertDiscountSchema } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, Edit, Trash2, Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import type { Product, Order, Discount } from "@shared/schema";

const productFormSchema = insertProductSchema.extend({
  images: z.string().min(1, "At least one image URL is required"),
  sizes: z.string().min(1, "At least one size is required"),
  colors: z.string().min(1, "At least one color is required"),
});

const discountFormSchema = insertDiscountSchema.extend({
  validUntil: z.string().min(1, "Valid until date is required"),
});

type ProductFormData = z.infer<typeof productFormSchema>;
type DiscountFormData = z.infer<typeof discountFormSchema>;

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: discounts, isLoading: discountsLoading, error: discountsError } = useQuery<Discount[]>({
    queryKey: ["/api/discounts"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      category: "",
      images: "",
      sizes: "",
      colors: "",
      stock: 0,
      isActive: true,
    },
  });

  const discountForm = useForm<DiscountFormData>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      code: "",
      percentage: "0",
      validUntil: "",
      isActive: true,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const productData = {
        ...data,
        images: data.images.split(',').map(url => url.trim()),
        sizes: data.sizes.split(',').map(size => size.trim()),
        colors: data.colors.split(',').map(color => color.trim()),
      };
      return await apiRequest("POST", "/api/products", productData);
    },
    onSuccess: () => {
      toast({ title: "Product created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsProductDialogOpen(false);
      productForm.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Admin access required. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Failed to create product",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const productData = {
        ...data,
        images: data.images.split(',').map(url => url.trim()),
        sizes: data.sizes.split(',').map(size => size.trim()),
        colors: data.colors.split(',').map(color => color.trim()),
      };
      return await apiRequest("PUT", `/api/products/${id}`, productData);
    },
    onSuccess: () => {
      toast({ title: "Product updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Admin access required. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Failed to update product",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Product deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Admin access required. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Failed to delete product",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PUT", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({ title: "Order status updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Admin access required. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Failed to update order status",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const createDiscountMutation = useMutation({
    mutationFn: async (data: DiscountFormData) => {
      const discountData = {
        ...data,
        validUntil: new Date(data.validUntil),
      };
      return await apiRequest("POST", "/api/discounts", discountData);
    },
    onSuccess: () => {
      toast({ title: "Discount created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/discounts"] });
      setIsDiscountDialogOpen(false);
      discountForm.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Admin access required. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Failed to create discount",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images.join(', '),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      stock: product.stock || 0,
      isActive: product.isActive,
    });
    setIsProductDialogOpen(true);
  };

  const handleProductSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleDiscountSubmit = (data: DiscountFormData) => {
    createDiscountMutation.mutate(data);
  };

  // Calculate stats
  const stats = {
    totalOrders: orders?.length || 0,
    revenue: orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0,
    products: products?.length || 0,
    customers: orders ? new Set(orders.map(order => order.userId)).size : 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your store</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-black" data-testid="stat-total-orders">
                    {stats.totalOrders}
                  </h3>
                  <p className="text-gray-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-black" data-testid="stat-revenue">
                    ${stats.revenue.toLocaleString()}
                  </h3>
                  <p className="text-gray-600">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-black" data-testid="stat-products">
                    {stats.products}
                  </h3>
                  <p className="text-gray-600">Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-black" data-testid="stat-customers">
                    {stats.customers}
                  </h3>
                  <p className="text-gray-600">Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Card>
          <Tabs defaultValue="products" className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="h-12 p-0 bg-transparent">
                <TabsTrigger 
                  value="products" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-4"
                  data-testid="tab-products"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-4"
                  data-testid="tab-orders"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="discounts" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-4"
                  data-testid="tab-discounts"
                >
                  Discounts
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="products" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-black">Product Management</h3>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={() => {
                        setEditingProduct(null);
                        productForm.reset();
                      }}
                      data-testid="button-add-product"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...productForm}>
                      <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-product-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={productForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-product-category" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={productForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={3} data-testid="textarea-product-description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} data-testid="input-product-price" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={productForm.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                    data-testid="input-product-stock" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={productForm.control}
                          name="images"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Images (comma-separated URLs)</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={2} data-testid="textarea-product-images" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="sizes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sizes (comma-separated)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="XS, S, M, L, XL" data-testid="input-product-sizes" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={productForm.control}
                            name="colors"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Colors (comma-separated)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Black, White, Navy" data-testid="input-product-colors" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            className="bg-black text-white hover:bg-gray-800"
                            disabled={createProductMutation.isPending || updateProductMutation.isPending}
                            data-testid="button-save-product"
                          >
                            {createProductMutation.isPending || updateProductMutation.isPending 
                              ? "Saving..." 
                              : editingProduct ? "Update Product" : "Add Product"
                            }
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {productsLoading && (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              )}

              {productsError && (
                <div className="text-center text-red-600 py-8">
                  <p>Failed to load products. Please try again later.</p>
                </div>
              )}

              {!productsLoading && !productsError && products && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow key={product.id} data-testid={`row-product-${index}`}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                data-testid={`button-edit-product-${index}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    data-testid={`button-delete-product-${index}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteProductMutation.mutate(product.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      data-testid={`button-confirm-delete-${index}`}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders" className="p-6">
              <h3 className="text-xl font-semibold text-black mb-6">Order Management</h3>
              
              {ordersLoading && (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              )}

              {ordersError && (
                <div className="text-center text-red-600 py-8">
                  <p>Failed to load orders. Please try again later.</p>
                </div>
              )}

              {!ordersLoading && !ordersError && orders && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, index) => (
                        <TableRow key={order.id} data-testid={`row-order-${index}`}>
                          <TableCell className="font-medium">
                            #{order.id.slice(-8).toUpperCase()}
                          </TableCell>
                          <TableCell>{order.userId}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt || "").toLocaleDateString()}
                          </TableCell>
                          <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>
                          <TableCell>
                            <Select
                              defaultValue={order.status || "pending"}
                              onValueChange={(value) => 
                                updateOrderStatusMutation.mutate({ id: order.id, status: value })
                              }
                            >
                              <SelectTrigger className="w-32" data-testid={`select-order-status-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-view-order-${index}`}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="discounts" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-black">Discount Management</h3>
                <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800"
                      data-testid="button-add-discount"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Discount
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Discount</DialogTitle>
                    </DialogHeader>
                    <Form {...discountForm}>
                      <form onSubmit={discountForm.handleSubmit(handleDiscountSubmit)} className="space-y-4">
                        <FormField
                          control={discountForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Code</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="SAVE20" data-testid="input-discount-code" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={discountForm.control}
                          name="percentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Percentage</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} placeholder="20" data-testid="input-discount-percentage" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={discountForm.control}
                          name="validUntil"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valid Until</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-discount-valid-until" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            className="bg-black text-white hover:bg-gray-800"
                            disabled={createDiscountMutation.isPending}
                            data-testid="button-save-discount"
                          >
                            {createDiscountMutation.isPending ? "Creating..." : "Create Discount"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {discountsLoading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              )}

              {discountsError && (
                <div className="text-center text-red-600 py-8">
                  <p>Failed to load discounts. Please try again later.</p>
                </div>
              )}

              {!discountsLoading && !discountsError && discounts && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Valid Until</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {discounts.map((discount, index) => (
                        <TableRow key={discount.id} data-testid={`row-discount-${index}`}>
                          <TableCell className="font-medium">{discount.code}</TableCell>
                          <TableCell>{parseFloat(discount.percentage).toFixed(1)}%</TableCell>
                          <TableCell>
                            {new Date(discount.validUntil).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={discount.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {discount.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              data-testid={`button-delete-discount-${index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
