'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href={user ? '/dashboard' : '/'}>
            <motion.h1
              className="text-2xl font-display font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              Dishly
            </motion.h1>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/restaurants"
                  className="text-neutral-700 hover:text-primary-600 transition-colors font-medium text-sm"
                >
                  Restaurants
                </Link>
                <Link
                  href="/cart"
                  className="relative text-neutral-700 hover:text-primary-600 transition-colors font-medium text-sm"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                    {getItemCount() > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-soft"
                        style={{ background: 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)' }}
                      >
                        {getItemCount()}
                      </motion.span>
                    )}
                  </div>
                </Link>
                <Link
                  href="/orders"
                  className="text-neutral-700 hover:text-primary-600 transition-colors font-medium text-base"
                >
                  Orders
                </Link>
                <div className="flex items-center gap-2 text-neutral-700 text-base px-3 py-2 bg-neutral-50 rounded-full">
                  <User className="h-5 w-5" />
                  <span className="font-medium">
                    {user.email.split('@')[0]}
                    <span className="text-sm text-neutral-500 ml-1.5">({user.role})</span>
                  </span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-error-500 text-white px-5 py-2.5 rounded-full hover:bg-error-600 transition-colors font-medium text-base shadow-soft"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-neutral-700 hover:text-primary-600 transition-colors font-medium text-base"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white px-6 py-2.5 rounded-full hover:shadow-medium transition-all font-medium text-base"
                  style={{ background: 'linear-gradient(135deg, #0a9396 0%, #005f73 100%)' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-700 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 space-y-2 pb-4 border-t border-neutral-100 pt-4"
            >
              {user ? (
                <>
                  <Link
                    href="/restaurants"
                    className="block text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-colors py-2.5 px-3 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Restaurants
                  </Link>
                  <Link
                    href="/cart"
                    className="block text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-colors py-2.5 px-3 rounded-lg relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>Cart</span>
                      {getItemCount() > 0 && (
                        <span className="text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)' }}>
                          {getItemCount()}
                        </span>
                      )}
                    </div>
                  </Link>
                  <Link
                    href="/orders"
                    className="block text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-colors py-2.5 px-3 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <div className="pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-neutral-700 py-2.5 px-3 text-sm">
                      <User className="h-4 w-4" />
                      <span>
                        {user.email.split('@')[0]}
                        <span className="text-xs text-neutral-500 ml-1">({user.role})</span>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-error-600 hover:text-error-700 hover:bg-error-50 transition-colors py-2.5 px-3 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-colors py-2.5 px-3 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-colors py-2.5 px-3 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
