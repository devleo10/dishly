export type UserRole = 'admin' | 'manager' | 'member';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
export type PaymentType = 'card' | 'wallet';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  createdAt: string;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  priceAtOrderTime: string;
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface PaymentMethod {
  id: number;
  userId: number;
  type: PaymentType;
  cardNumber: string | null;
  expiryDate: string | null;
  cardholderName: string | null;
  isDefault: number;
  createdAt: string;
}

export interface CartItem {
  menuItemId: number;
  name: string;
  price: string;
  quantity: number;
  restaurantId: number;
}

