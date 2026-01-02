'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      {...props}
    />
  );
}


