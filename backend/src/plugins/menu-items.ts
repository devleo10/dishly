import { Elysia } from 'elysia';
import { db } from '../db';
import { menuItems } from '../db/schema';
import { eq } from 'drizzle-orm';

export const menuItemsPlugin = new Elysia({ prefix: '/menu-items' })
  .get('/:id', async ({ params, error }) => {
    const { id } = params as { id: string };
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      throw error(400, { message: 'Invalid menu item ID' });
    }

    const [item] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, itemId))
      .limit(1);

    if (!item) {
      throw error(404, { message: 'Menu item not found' });
    }

    return {
      menuItem: item,
    };
  });

