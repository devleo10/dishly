import { Elysia } from 'elysia';
import { db } from '../db';
import { orders, orderItems, menuItems } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { jwt } from '@elysiajs/jwt';
import { roleMiddleware } from './role-middleware';

export const ordersPlugin = new Elysia({ prefix: '/orders' })
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
  .get('/', async ({ getCurrentUser, error }) => {
    const user = await getCurrentUser();
    const userId = user.userId as number;

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));

    return {
      orders: userOrders,
    };
  })
  .get('/:id', async ({ params, getCurrentUser, error }) => {
    const { id } = params as { id: string };
    const orderId = parseInt(id);
    const user = await getCurrentUser();
    const userId = user.userId as number;

    if (isNaN(orderId)) {
      throw error(400, { message: 'Invalid order ID' });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
      .limit(1);

    if (!order) {
      throw error(404, { message: 'Order not found' });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return {
      order: {
        ...order,
        items,
      },
    };
  })
  .post('/', async ({ body, getCurrentUser, error }) => {
    const user = await getCurrentUser();
    const userId = user.userId as number;

    const { restaurantId, items } = body as {
      restaurantId: number;
      items: Array<{ menuItemId: number; quantity: number }>;
    };

    if (!restaurantId || !items || items.length === 0) {
      throw error(400, { message: 'Restaurant ID and items are required' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const [menuItem] = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, item.menuItemId))
        .limit(1);

      if (!menuItem) {
        throw error(404, { message: `Menu item ${item.menuItemId} not found` });
      }

      const price = parseFloat(menuItem.price);
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtOrderTime: menuItem.price,
      });
    }

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId,
        restaurantId,
        totalAmount: totalAmount.toString(),
        status: 'pending',
      })
      .returning();

    // Create order items
    const insertedItems = await db
      .insert(orderItems)
      .values(
        orderItemsData.map((item) => ({
          orderId: newOrder.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceAtOrderTime: item.priceAtOrderTime,
        }))
      )
      .returning();

    return {
      message: 'Order created successfully',
      order: {
        ...newOrder,
        items: insertedItems,
      },
    };
  })
  .patch(
    '/:id/cancel',
    async ({ params, getCurrentUser, error }) => {
      const { id } = params as { id: string };
      const orderId = parseInt(id);
      const user = await getCurrentUser();
      const userId = user.userId as number;
      const userRole = user.role as string;

      // Check role (Admin or Manager only)
      if (userRole !== 'admin' && userRole !== 'manager') {
        throw error(403, { message: 'Only Admin and Manager can cancel orders' });
      }

      if (isNaN(orderId)) {
        throw error(400, { message: 'Invalid order ID' });
      }

      const [order] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
        .limit(1);

      if (!order) {
        throw error(404, { message: 'Order not found' });
      }

      if (order.status === 'cancelled') {
        throw error(400, { message: 'Order is already cancelled' });
      }

      if (order.status === 'delivered') {
        throw error(400, { message: 'Cannot cancel a delivered order' });
      }

      const [updatedOrder] = await db
        .update(orders)
        .set({
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      return {
        message: 'Order cancelled successfully',
        order: updatedOrder,
      };
    },
    {
      beforeHandle: async ({ getCurrentUser, error }) => {
        const user = await getCurrentUser();
        const userRole = user.role as string;

        if (userRole !== 'admin' && userRole !== 'manager') {
          throw error(403, { message: 'Only Admin and Manager can cancel orders' });
        }
      },
    }
  );

