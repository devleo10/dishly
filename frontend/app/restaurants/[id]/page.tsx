'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Plus, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { StaggerContainer, staggerItem } from '@/components/ui/StaggerContainer';
import type { Restaurant, MenuItem } from '@/types';

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = parseInt(params.id as string);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant();
      fetchMenuItems();
    }
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}`);
      setRestaurant(response.data.restaurant);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch restaurant');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu-items`);
      setMenuItems(response.data.menuItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      restaurantId: item.restaurantId,
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
        <div className="container mx-auto px-4 py-12">
          {restaurant && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Card className="p-8 border-0 shadow-medium mb-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-neutral-800">
                  {restaurant.name}
                </h1>
                {restaurant.description && (
                  <p className="text-neutral-600 text-lg mb-4">{restaurant.description}</p>
                )}
                {restaurant.address && (
                  <div className="flex items-center text-neutral-500">
                    <MapPin className="h-5 w-5 mr-2" />
                    {restaurant.address}
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
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
          ) : menuItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-neutral-600 text-lg">No menu items available</p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-3xl font-display font-bold mb-6 text-neutral-800">Menu</h2>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <motion.div key={item.id} variants={staggerItem}>
                    <Card className="h-full flex flex-col hover:shadow-medium transition-all duration-300">
                      <div className="h-40 bg-gradient-to-br from-secondary-300 to-secondary-500 rounded-xl mb-4 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                        <span className="text-5xl">🍕</span>
                      </div>
                      <div className="grow">
                        <h3 className="text-xl font-semibold mb-2 text-neutral-800">{item.name}</h3>
                        {item.description && (
                          <p className="text-neutral-600 mb-4 text-sm line-clamp-2">{item.description}</p>
                        )}
                        <p className="text-2xl font-bold text-primary-600 mb-4">
                          ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full"
                        icon={<Plus className="h-5 w-5" />}
                      >
                        Add to Cart
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </StaggerContainer>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
