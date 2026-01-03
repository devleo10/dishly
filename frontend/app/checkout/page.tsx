'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RoleGuard } from '@/components/RoleGuard';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import type { PaymentMethod, Order } from '@/types';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get('/payment-methods');
      setPaymentMethods(response.data.paymentMethods);
    } catch (err: any) {
      console.error('Failed to fetch payment methods:', err);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const restaurantId = items[0].restaurantId;
      const orderItems = items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      }));

      const orderResponse = await api.post('/orders', {
        restaurantId,
        items: orderItems,
      });

      const newOrder = orderResponse.data.order;

      await api.post('/checkout', {
        orderId: newOrder.id,
        paymentMethodId: selectedPaymentMethod || undefined,
      });

      setOrder(newOrder);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed');
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <RoleGuard allowedRoles={['admin', 'manager']}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-success-50 via-white to-primary-50/20 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <Card className="p-8 border-0 shadow-medium">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-gradient-to-br from-success-400 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-display font-bold mb-4 gradient-text">
                Order Placed Successfully!
              </h2>
              <p className="text-neutral-600 mb-6">Order #{order.id} has been confirmed.</p>
              <Link href="/orders">
                <Button size="lg" className="w-full">
                  View Orders
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'manager']}>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 text-neutral-800">
              <span className="gradient-text">Checkout</span>
            </h1>
            <p className="text-neutral-600">Complete your order</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="hover:shadow-medium transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-neutral-800">Order Summary</h2>
                </div>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between items-center py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 rounded-lg px-2 -mx-2 transition-colors">
                      <div>
                        <span className="font-medium text-neutral-800">{item.name}</span>
                        <span className="text-neutral-600 ml-2">x {item.quantity}</span>
                      </div>
                      <span className="font-semibold text-neutral-800">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200 pt-4 flex justify-between text-xl font-bold">
                  <span className="text-neutral-800">Total:</span>
                  <span className="gradient-text">${getTotal().toFixed(2)}</span>
                </div>
              </Card>

              <Card className="hover:shadow-medium transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-neutral-800">Payment Method</h2>
                </div>
                {paymentMethods.length > 0 ? (
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <motion.label
                        key={method.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50 shadow-soft'
                            : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                          className="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-neutral-800">
                            {method.type === 'card' ? 'Card' : 'Wallet'}
                            {method.isDefault === 1 && (
                              <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </p>
                          {method.cardholderName && (
                            <p className="text-sm text-neutral-600">{method.cardholderName}</p>
                          )}
                        </div>
                      </motion.label>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-600 text-center py-4">
                    No payment methods available. Payment will be processed without a saved method.
                  </p>
                )}
              </Card>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-24"
              >
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-neutral-800">Order Total</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-xl font-bold">
                      <span className="text-neutral-800">Total</span>
                      <span className="gradient-text">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Processing...' : 'Complete Checkout'}
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
