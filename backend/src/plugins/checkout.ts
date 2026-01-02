import { Elysia } from 'elysia';
import { db } from '../db';
import { orders, paymentMethods } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { jwt } from '@elysiajs/jwt';

export const checkoutPlugin = new Elysia({ prefix: '/checkout' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'your-secret-key',
    })
  )
  .derive({ as: 'scoped' }, ({ jwt, headers, error }) => {
    return {
      async getCurrentUser() {
        const token = headers.authorization?.replace('Bearer ', '');

        if (!token) {
          throw error(401, { message: 'Unauthorized' });
        }

        const payload = await jwt.verify(token);

        if (!payload) {
          throw error(401, { message: 'Invalid token' });
        }

        return payload;
      },
    };
  })
  .post(
    '/',
    async ({ body, getCurrentUser, error }) => {
      const user = await getCurrentUser();
      const userRole = user.role as string;

      // Admin and Manager only
      if (userRole !== 'admin' && userRole !== 'manager') {
        throw error(403, { message: 'Only Admin and Manager can checkout' });
      }

      const { orderId, paymentMethodId } = body as {
        orderId: number;
        paymentMethodId?: number;
      };

      if (!orderId) {
        throw error(400, { message: 'Order ID is required' });
      }

      const userId = user.userId as number;

      // Get order
      const [order] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
        .limit(1);

      if (!order) {
        throw error(404, { message: 'Order not found' });
      }

      if (order.status !== 'pending') {
        throw error(400, { message: 'Order is not in pending status' });
      }

      // Verify payment method if provided
      if (paymentMethodId) {
        const [paymentMethod] = await db
          .select()
          .from(paymentMethods)
          .where(and(eq(paymentMethods.id, paymentMethodId), eq(paymentMethods.userId, userId)))
          .limit(1);

        if (!paymentMethod) {
          throw error(404, { message: 'Payment method not found' });
        }
      }

      // Update order status to confirmed (mock payment processing)
      const [updatedOrder] = await db
        .update(orders)
        .set({
          status: 'confirmed',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      return {
        message: 'Checkout successful',
        order: updatedOrder,
      };
    },
    {
      beforeHandle: async ({ getCurrentUser, error }) => {
        const user = await getCurrentUser();
        const userRole = user.role as string;

        if (userRole !== 'admin' && userRole !== 'manager') {
          throw error(403, { message: 'Only Admin and Manager can checkout' });
        }
      },
    }
  );


