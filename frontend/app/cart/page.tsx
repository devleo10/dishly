'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 text-neutral-800">
              Shopping <span className="gradient-text">Cart</span>
            </h1>
            <p className="text-neutral-600">Review your items before checkout</p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-400 rounded-full flex items-center justify-center mb-6 shadow-soft">
                <ShoppingBag className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-neutral-800">Your cart is empty</h2>
              <p className="text-neutral-600 mb-6">Start adding items to your cart</p>
              <Link href="/restaurants">
                <Button size="lg">Browse Restaurants</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.menuItemId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-6 hover:shadow-medium transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1 w-full">
                            <h3 className="text-xl font-semibold mb-1 text-neutral-800">{item.name}</h3>
                            <p className="text-neutral-600 mb-3">${parseFloat(item.price).toFixed(2)} each</p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 border-2 border-neutral-200 rounded-full hover:border-primary-300 transition-colors">
                                <button
                                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                  className="p-2 hover:bg-primary-50 hover:text-primary-600 transition-colors rounded-full"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 font-semibold min-w-12 text-center text-neutral-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                  className="p-2 hover:bg-primary-50 hover:text-primary-600 transition-colors rounded-full"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:flex-col sm:items-end w-full sm:w-auto">
                            <p className="text-2xl font-bold text-primary-600">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => {
                                removeItem(item.menuItemId);
                                toast.success('Item removed from cart');
                              }}
                              className="text-error-600 hover:text-error-700 hover:bg-error-50 p-2 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sticky top-24"
                >
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-neutral-800">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-neutral-600">
                        <span>Subtotal</span>
                        <span>${getTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between items-center">
                        <span className="text-xl font-semibold text-neutral-800">Total</span>
                        <span className="text-2xl font-bold gradient-text">
                          ${getTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Link href="/checkout" className="block">
                        <Button className="w-full" size="lg">
                          Proceed to Checkout
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          clearCart();
                          toast.success('Cart cleared');
                        }}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
