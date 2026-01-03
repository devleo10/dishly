'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Calendar, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = parseInt(params.id as string);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.order);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cancelled':
        return 'bg-error-100 text-error-800 border-error-200';
      case 'delivered':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'confirmed':
      case 'preparing':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 text-neutral-800">
              Order <span className="gradient-text">Details</span>
            </h1>
            <p className="text-neutral-600">View your order information</p>
          </motion.div>

          {loading ? (
            <Skeleton className="h-96 rounded-2xl" />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-xl text-center"
            >
              {error}
            </motion.div>
          ) : order ? (
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-medium hover:shadow-large transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-neutral-800">Order #{order.id}</h2>
                    <div className="flex items-center gap-4 text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-neutral-800">
                      <Package className="h-5 w-5" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center py-3 px-3 -mx-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 rounded-lg transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-neutral-800">Item #{item.menuItemId}</p>
                            <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-lg text-neutral-800">
                            ${(parseFloat(item.priceAtOrderTime) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-xl font-semibold text-neutral-800">Total:</span>
                    </div>
                    <span className="text-3xl font-bold gradient-text">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
