'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { RoleGuard } from '@/components/RoleGuard';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { StaggerContainer, staggerItem } from '@/components/ui/StaggerContainer';
import type { PaymentMethod } from '@/types';

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: 'card' as 'card' | 'wallet',
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get('/payment-methods');
      setPaymentMethods(response.data.paymentMethods);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payment methods');
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.patch(`/payment-methods/${editingId}`, formData);
        toast.success('Payment method updated');
      } else {
        await api.post('/payment-methods', formData);
        toast.success('Payment method added');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        type: 'card',
        cardNumber: '',
        expiryDate: '',
        cardholderName: '',
        isDefault: false,
      });
      fetchPaymentMethods();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save payment method';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingId(method.id);
    setFormData({
      type: method.type,
      cardNumber: method.cardNumber || '',
      expiryDate: method.expiryDate || '',
      cardholderName: method.cardholderName || '',
      isDefault: method.isDefault === 1,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    try {
      await api.delete(`/payment-methods/${id}`);
      toast.success('Payment method deleted');
      fetchPaymentMethods();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete payment method');
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 text-neutral-800">
                Payment <span className="gradient-text">Methods</span>
              </h1>
              <p className="text-neutral-600">Manage your payment methods</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({
                    type: 'card',
                    cardNumber: '',
                    expiryDate: '',
                    cardholderName: '',
                    isDefault: false,
                  });
                }}
                icon={<Plus className="h-5 w-5" />}
              >
                Add Payment Method
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Card className="p-6 border-0 shadow-medium hover:shadow-large transition-all duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-800">
                      {editingId ? 'Edit' : 'Add'} Payment Method
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                      className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 p-2 rounded-lg transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'card' | 'wallet' })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
                      >
                        <option value="card">Card</option>
                        <option value="wallet">Wallet</option>
                      </select>
                    </div>
                    <Input
                      label="Card Number"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                    />
                    <Input
                      label="Expiry Date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      placeholder="MM/YY"
                    />
                    <Input
                      label="Cardholder Name"
                      value={formData.cardholderName}
                      onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                    />
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="mr-2"
                      />
                      <label className="text-sm font-medium text-neutral-700">
                        Set as default payment method
                      </label>
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : paymentMethods.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-400 rounded-full flex items-center justify-center mb-6 shadow-soft">
                <CreditCard className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-neutral-800">No payment methods</h2>
              <p className="text-neutral-600 mb-6">Add a payment method to get started</p>
            </motion.div>
          ) : (
            <StaggerContainer className="space-y-4">
              {paymentMethods.map((method) => (
                <motion.div key={method.id} variants={staggerItem}>
                  <Card className="p-6 hover:shadow-medium transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-neutral-800">
                            {method.type === 'card' ? 'Card' : 'Wallet'}
                          </h3>
                          {method.isDefault === 1 && (
                            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        {method.cardholderName && (
                          <p className="text-neutral-600 mb-1">{method.cardholderName}</p>
                        )}
                        {method.cardNumber && (
                          <p className="text-sm text-neutral-500">**** {method.cardNumber.slice(-4)}</p>
                        )}
                        {method.expiryDate && (
                          <p className="text-sm text-neutral-500">Expires: {method.expiryDate}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => handleEdit(method)}
                          icon={<Edit className="h-4 w-4" />}
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(method.id)}
                          icon={<Trash2 className="h-4 w-4" />}
                          className="text-error-600 hover:text-error-700 hover:bg-error-50"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
