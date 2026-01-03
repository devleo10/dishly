'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils, ShoppingBag, CreditCard, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StaggerContainer, staggerItem } from '@/components/ui/StaggerContainer';

export default function DashboardPage() {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Restaurants',
      description: 'Browse restaurants and menu items',
      href: '/restaurants',
      icon: <Utensils className="h-8 w-8" />,
      gradient: 'from-primary-500 to-primary-700',
      available: true,
    },
    {
      title: 'My Orders',
      description: 'View your order history',
      href: '/orders',
      icon: <ShoppingBag className="h-8 w-8" />,
      gradient: 'from-secondary-500 to-secondary-700',
      available: true,
    },
    {
      title: 'Checkout',
      description: 'Process orders and payments',
      href: '/checkout',
      icon: <CreditCard className="h-8 w-8" />,
      gradient: 'from-accent-500 to-accent-700',
      available: user?.role === 'admin' || user?.role === 'manager',
    },
    {
      title: 'Payment Methods',
      description: 'Manage payment methods',
      href: '/payment-methods',
      icon: <Settings className="h-8 w-8" />,
      gradient: 'from-neutral-600 to-neutral-800',
      available: user?.role === 'admin',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-neutral-800">
              Welcome back, <span className="gradient-text">{user?.email.split('@')[0]}</span>
            </h1>
            <p className="text-neutral-600 text-lg">
              {user?.role === 'admin' && 'Full access to all features'}
              {user?.role === 'manager' && 'Manage orders and checkout'}
              {user?.role === 'member' && 'Browse and order from restaurants'}
            </p>
          </motion.div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards
              .filter((card) => card.available)
              .map((card, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Link href={card.href} className="group block h-full">
                    <Card className="h-full group-hover:shadow-medium transition-all duration-300">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} text-white mb-4 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                        {card.icon}
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 text-neutral-800 group-hover:text-primary-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-neutral-600">{card.description}</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
          </StaggerContainer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
