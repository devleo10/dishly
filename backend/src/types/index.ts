export type UserRole = 'admin' | 'manager' | 'member';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
export type PaymentType = 'card' | 'wallet';

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}




