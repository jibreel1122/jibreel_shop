import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Order, User } from "@shared/schema";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return await apiRequest("PUT", "/api/auth/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">My Account</h1>
          <p className="text-xl text-gray-600">Manage your profile and orders</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-1/2 mx-auto">
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="bg-black text-white hover:bg-gray-800"
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-update-profile"
                    >
                      {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/6 mb-3"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                )}

                {ordersError && (
                  <div className="text-center text-red-600 py-8">
                    <p>Failed to load orders. Please try again later.</p>
                  </div>
                )}

                {!ordersLoading && !ordersError && (!orders || orders.length === 0) && (
                  <div className="text-center text-gray-600 py-8">
                    <p className="mb-4">You haven't placed any orders yet.</p>
                    <Button asChild className="bg-black text-white hover:bg-gray-800" data-testid="button-start-shopping">
                      <Link href="/catalog">Start Shopping</Link>
                    </Button>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders && orders.length > 0 && (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4" data-testid={`order-${index}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-black" data-testid={`text-order-id-${index}`}>
                              Order #{order.id.slice(-8).toUpperCase()}
                            </h4>
                            <p className="text-sm text-gray-600" data-testid={`text-order-date-${index}`}>
                              {new Date(order.createdAt || "").toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </p>
                          </div>
                          <Badge 
                            className={`${getStatusColor(order.status || "")} capitalize`}
                            data-testid={`badge-order-status-${index}`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {Array.isArray(order.items) 
                                ? `${order.items.length} item${order.items.length > 1 ? 's' : ''}`
                                : "Items"
                              }
                            </span>
                            <span className="font-semibold text-black" data-testid={`text-order-total-${index}`}>
                              ${parseFloat(order.total).toFixed(2)}
                            </span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                              data-testid={`button-view-order-${index}`}
                            >
                              <Link href={`/order/${order.id}`}>View Details</Link>
                            </Button>
                            
                            {(order.status === "delivered" || order.status === "shipped") && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-reorder-${index}`}
                              >
                                Reorder
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
