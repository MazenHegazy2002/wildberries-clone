export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewCount?: number;
  soldCount?: number;
  imageUrl?: string;
  emoji?: string;
  colors?: string[];
  sizes?: string[];
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
  article?: string;
  model?: string;
  seller?: string;
  sellerRating?: number;
  description?: string;
  specs?: [string, string][];
  images?: string[];
  tags?: string[];
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  parentId?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'USER' | 'VENDOR' | 'ADMIN';
  avatar?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  vendorId?: string;
  total: number;
  status: OrderStatus;
  address?: string;
  city?: string;
  deliveryMethod?: string;
  paymentMethod?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  isPinned?: boolean;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  city: string;
  street: string;
  building: string;
  apartment?: string;
  isDefault: boolean;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type UserRole = 'USER' | 'VENDOR' | 'ADMIN';

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  rating: number;
  productsCount: number;
  ordersCount: number;
  approved: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalVendors: number;
  averageOrderValue: number;
}

export interface SellerStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalSold: number;
  averageOrderValue: number;
}

export interface OrderStatusCount {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}