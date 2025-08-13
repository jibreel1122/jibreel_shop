import {
  users,
  products,
  orders,
  discounts,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type Discount,
  type InsertDiscount,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, gte, lte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Product operations
  getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Order operations
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  
  // Discount operations
  getDiscounts(): Promise<Discount[]>;
  getDiscountByCode(code: string): Promise<Discount | undefined>;
  createDiscount(discount: InsertDiscount): Promise<Discount>;
  updateDiscount(id: string, discount: Partial<InsertDiscount>): Promise<Discount>;
  deleteDiscount(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.isActive, true));
    
    const conditions = [eq(products.isActive, true)];
    
    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }
    
    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice.toString()));
    }
    
    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice.toString()));
    }
    
    if (filters?.search) {
      conditions.push(like(products.name, `%${filters.search}%`));
    }
    
    return await db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  // Order operations
  async getOrders(userId?: string): Promise<Order[]> {
    const conditions = userId ? [eq(orders.userId, userId)] : [];
    return await db.select().from(orders).where(and(...conditions)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Discount operations
  async getDiscounts(): Promise<Discount[]> {
    return await db.select().from(discounts).where(eq(discounts.isActive, true));
  }

  async getDiscountByCode(code: string): Promise<Discount | undefined> {
    const [discount] = await db
      .select()
      .from(discounts)
      .where(and(eq(discounts.code, code), eq(discounts.isActive, true)));
    return discount;
  }

  async createDiscount(discount: InsertDiscount): Promise<Discount> {
    const [newDiscount] = await db.insert(discounts).values(discount).returning();
    return newDiscount;
  }

  async updateDiscount(id: string, discount: Partial<InsertDiscount>): Promise<Discount> {
    const [updatedDiscount] = await db
      .update(discounts)
      .set(discount)
      .where(eq(discounts.id, id))
      .returning();
    return updatedDiscount;
  }

  async deleteDiscount(id: string): Promise<void> {
    await db.update(discounts).set({ isActive: false }).where(eq(discounts.id, id));
  }
}

export const storage = new DatabaseStorage();
