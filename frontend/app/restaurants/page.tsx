'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { StaggerContainer, staggerItem } from '@/components/ui/StaggerContainer';
import type { Restaurant } from '@/types';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data.restaurants);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch restaurants');
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-primary-50/20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-neutral-800">
              Discover <span className="gradient-text">Restaurants</span>
            </h1>
            <p className="text-neutral-600 text-lg">Explore amazing dining options</p>
          </motion.div>

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
          ) : restaurants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-neutral-600 text-lg">No restaurants available yet</p>
            </motion.div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <motion.div key={restaurant.id} variants={staggerItem}>
                  <Link href={`/restaurants/${restaurant.id}`} className="group block h-full">
                    <Card className="h-full group-hover:shadow-medium transition-all duration-300">
                      <div className="h-48 bg-linear-to-br from-primary-300 to-primary-500 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <span className="text-5xl">🍽️</span>
                      </div>
                      <h2 className="text-2xl font-semibold mb-2 text-neutral-800 group-hover:text-primary-600 transition-colors">
                        {restaurant.name}
                      </h2>
                      {restaurant.description && (
                        <p className="text-neutral-600 mb-4 line-clamp-2">{restaurant.description}</p>
                      )}
                      {restaurant.address && (
                        <div className="flex items-center text-sm text-neutral-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {restaurant.address}
                        </div>
                      )}
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
