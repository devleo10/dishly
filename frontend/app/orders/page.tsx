'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { X, Eye, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { StaggerContainer, staggerItem } from '@/components/ui/StaggerContainer';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
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
      <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-primary-50/20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 text-neutral-800">
              My <span className="gradient-text">Orders</span>
            </h1>
            <p className="text-neutral-600">View and manage your order history</p>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-xl text-center"
            >
              {error}
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-32 h-32 bg-linear-to-br from-primary-200 to-primary-400 rounded-full flex items-center justify-center mb-6 shadow-soft">
                <Package className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-neutral-800">No orders yet</h2>
              <p className="text-neutral-600 mb-6">Start ordering from our restaurants</p>
              <Link href="/restaurants">
                <Button size="lg">Browse Restaurants</Button>
              </Link>
            </motion.div>
          ) : (
            <StaggerContainer className="space-y-4">
              {orders.map((order) => (
                <motion.div key={order.id} variants={staggerItem}>
                  <Card className="p-6 hover:shadow-medium transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-neutral-800">Order #{order.id}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-2xl font-bold gradient-text">
                          ${parseFloat(order.totalAmount).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" icon={<Eye className="h-4 w-4" />}>
                            View Details
                          </Button>
                        </Link>
                        {(user?.role === 'admin' || user?.role === 'manager') &&
                          order.status !== 'cancelled' &&
                          order.status !== 'delivered' && (
                            <Button
                              variant="outline"
                              onClick={() => handleCancel(order.id)}
                              icon={<X className="h-4 w-4" />}
                              className="text-error-600 border-error-200 hover:bg-error-50 hover:border-error-300"
                            >
                              Cancel
                            </Button>
                          )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
