import { Elysia } from 'elysia';
import { db } from '../db';
import { paymentMethods } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { jwt } from '@elysiajs/jwt';
import { roleMiddleware } from './role-middleware';

export const paymentMethodsPlugin = new Elysia({ prefix: '/payment-methods' })
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
  .get('/', async ({ getCurrentUser }) => {
    const user = await getCurrentUser();
    const userId = user.userId as number;

    const methods = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId));

    return {
      paymentMethods: methods,
    };
  })
  .post(
    '/',
    async ({ body, getCurrentUser, error }) => {
      const user = await getCurrentUser();
      const userRole = user.role as string;

      // Admin only
      if (userRole !== 'admin') {
        throw error(403, { message: 'Only Admin can add payment methods' });
      }

      const { type, cardNumber, expiryDate, cardholderName, isDefault } = body as {
        type: 'card' | 'wallet';
        cardNumber?: string;
        expiryDate?: string;
        cardholderName?: string;
        isDefault?: boolean;
      };

      const userId = user.userId as number;

      // If setting as default, unset other defaults
      if (isDefault) {
        await db
          .update(paymentMethods)
          .set({ isDefault: 0 })
          .where(eq(paymentMethods.userId, userId));
      }

      const [newMethod] = await db
        .insert(paymentMethods)
        .values({
          userId,
          type,
          cardNumber: cardNumber || null,
          expiryDate: expiryDate || null,
          cardholderName: cardholderName || null,
          isDefault: isDefault ? 1 : 0,
        })
        .returning();

      return {
        message: 'Payment method added successfully',
        paymentMethod: newMethod,
      };
    },
    {
      beforeHandle: async ({ getCurrentUser, error }) => {
        const user = await getCurrentUser();
        const userRole = user.role as string;

        if (userRole !== 'admin') {
          throw error(403, { message: 'Only Admin can add payment methods' });
        }
      },
    }
  )
  .patch(
    '/:id',
    async ({ params, body, getCurrentUser, error }) => {
      const { id } = params as { id: string };
      const methodId = parseInt(id);
      const user = await getCurrentUser();
      const userRole = user.role as string;

      // Admin only
      if (userRole !== 'admin') {
        throw error(403, { message: 'Only Admin can update payment methods' });
      }

      if (isNaN(methodId)) {
        throw error(400, { message: 'Invalid payment method ID' });
      }

      const userId = user.userId as number;
      const updateData = body as Partial<{
        type: 'card' | 'wallet';
        cardNumber: string;
        expiryDate: string;
        cardholderName: string;
        isDefault: boolean;
      }>;

      // If setting as default, unset other defaults
      if (updateData.isDefault) {
        await db
          .update(paymentMethods)
          .set({ isDefault: 0 })
          .where(eq(paymentMethods.userId, userId));
      }

      const updateValues: any = {};
      if (updateData.type) updateValues.type = updateData.type;
      if (updateData.cardNumber !== undefined) updateValues.cardNumber = updateData.cardNumber;
      if (updateData.expiryDate !== undefined) updateValues.expiryDate = updateData.expiryDate;
      if (updateData.cardholderName !== undefined) updateValues.cardholderName = updateData.cardholderName;
      if (updateData.isDefault !== undefined) updateValues.isDefault = updateData.isDefault ? 1 : 0;

      const [updatedMethod] = await db
        .update(paymentMethods)
        .set(updateValues)
        .where(and(eq(paymentMethods.id, methodId), eq(paymentMethods.userId, userId)))
        .returning();

      if (!updatedMethod) {
        throw error(404, { message: 'Payment method not found' });
      }

      return {
        message: 'Payment method updated successfully',
        paymentMethod: updatedMethod,
      };
    },
    {
      beforeHandle: async ({ getCurrentUser, error }) => {
        const user = await getCurrentUser();
        const userRole = user.role as string;

        if (userRole !== 'admin') {
          throw error(403, { message: 'Only Admin can update payment methods' });
        }
      },
    }
  )
  .delete(
    '/:id',
    async ({ params, getCurrentUser, error }) => {
      const { id } = params as { id: string };
      const methodId = parseInt(id);
      const user = await getCurrentUser();
      const userRole = user.role as string;

      // Admin only
      if (userRole !== 'admin') {
        throw error(403, { message: 'Only Admin can delete payment methods' });
      }

      if (isNaN(methodId)) {
        throw error(400, { message: 'Invalid payment method ID' });
      }

      const userId = user.userId as number;

      const [deletedMethod] = await db
        .delete(paymentMethods)
        .where(and(eq(paymentMethods.id, methodId), eq(paymentMethods.userId, userId)))
        .returning();

      if (!deletedMethod) {
        throw error(404, { message: 'Payment method not found' });
      }

      return {
        message: 'Payment method deleted successfully',
      };
    },
    {
      beforeHandle: async ({ getCurrentUser, error }) => {
        const user = await getCurrentUser();
        const userRole = user.role as string;

        if (userRole !== 'admin') {
          throw error(403, { message: 'Only Admin can delete payment methods' });
        }
      },
    }
  );




