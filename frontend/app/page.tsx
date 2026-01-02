'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Utensils, ShoppingCart, Shield, Zap, ChefHat, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const features = [
    {
      icon: Utensils,
      title: 'Browse Restaurants',
      description: 'Discover amazing restaurants and their delicious menus',
      gradient: 'from-[#0a9396] to-[#005f73]',
      bgColor: 'bg-primary-50',
    },
    {
      icon: ShoppingCart,
      title: 'Easy Ordering',
      description: 'Add items to cart and checkout with ease',
      gradient: 'from-[#ffb703] to-[#fb8500]',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing',
      gradient: 'from-[#22c55e] to-[#16a34a]',
      bgColor: 'bg-success-50',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Quick order processing and delivery',
      gradient: 'from-[#e63946] to-[#f77f00]',
      bgColor: 'bg-accent-50',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-primary-50/30 overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-primary-200/40 to-primary-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-linear-to-br from-secondary-200/30 to-secondary-300/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-linear-to-br from-accent-200/20 to-accent-300/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 lg:py-40 relative z-10">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-8 shadow-soft"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-sm font-medium text-primary-700">Food ordering made simple</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-neutral-800 leading-tight"
            >
              Delicious Food,
              <br />
              <span className="gradient-text">Delivered Fresh</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-neutral-600 mb-12 font-light leading-relaxed max-w-2xl mx-auto px-4"
            >
              Order from your favorite local restaurants with our easy-to-use platform. 
              Fast delivery, secure payments, and exceptional service.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link href="/login" className="group w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full font-medium px-8 py-3.5 text-base text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #0a9396 0%, #005f73 100%)' }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full font-medium px-8 py-3.5 text-base border-2 bg-white hover:bg-neutral-50 transition-all duration-200"
                  style={{ borderColor: '#0a9396', color: '#0a9396' }}
                >
                  Create Account
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 text-neutral-500 text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['👨‍🍳', '👩‍🍳', '🧑‍🍳', '👨‍💼'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-sm"
                      style={{ background: `linear-gradient(135deg, #0a9396 0%, #005f73 100%)` }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="font-medium text-neutral-600">1,000+ customers</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4" style={{ fill: '#ffb703', color: '#ffb703' }} />
                ))}
                <span className="ml-1 font-medium text-neutral-600">4.9 rating</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-neutral-50/50 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: ChefHat, label: '100+ Restaurants', color: '#0a9396' },
              { icon: Zap, label: '30 min Delivery', color: '#fb8500' },
              { icon: Shield, label: 'Secure Payments', color: '#22c55e' },
              { icon: Star, label: '4.9★ Rating', color: '#e63946' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-soft border border-neutral-200 text-center cursor-pointer hover:shadow-medium transition-all duration-300"
              >
                <div 
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="h-6 w-6 md:h-7 md:w-7" style={{ color: stat.color }} />
                </div>
                <span className="text-sm md:text-base font-semibold text-neutral-700">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 text-neutral-800">
            Why Choose <span className="gradient-text">Dishly</span>?
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            We make food ordering simple, fast, and enjoyable with our user-friendly platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const gradientMap: Record<string, string> = {
              'from-[#0a9396] to-[#005f73]': 'linear-gradient(135deg, #0a9396 0%, #005f73 100%)',
              'from-[#ffb703] to-[#fb8500]': 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)',
              'from-[#22c55e] to-[#16a34a]': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              'from-[#e63946] to-[#f77f00]': 'linear-gradient(135deg, #e63946 0%, #f77f00 100%)',
            };
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className={`${feature.bgColor} rounded-2xl p-6 md:p-8 text-center h-full border border-neutral-100/50 hover:shadow-large transition-all duration-300 hover:border-neutral-200`}>
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-5 shadow-medium group-hover:scale-110 transition-transform duration-300"
                    style={{ background: gradientMap[feature.gradient] }}
                  >
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-800">{feature.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-10 md:p-16 lg:p-20 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #087f82 0%, #0a9396 50%, #087f82 100%)' }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              Ready to Order?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of food lovers who trust Dishly for their daily meals. 
              Sign up today and get your first order with free delivery!
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full font-medium px-8 py-3.5 text-base text-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)' }}
              >
                Start Ordering Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 md:py-16 border-t border-neutral-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
          <p>© 2026 Dishly. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-primary-600 transition-colors">Login</Link>
            <Link href="/register" className="hover:text-primary-600 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
