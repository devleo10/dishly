import { Elysia } from 'elysia';
import { db } from '../db';
import { restaurants, menuItems } from '../db/schema';
import { eq } from 'drizzle-orm';

export const restaurantsPlugin = new Elysia({ prefix: '/restaurants' })
  .get('/', async () => {
    const allRestaurants = await db.select().from(restaurants);

    return {
      restaurants: allRestaurants,
    };
  })
  .get('/:id', async ({ params, error }) => {
    const { id } = params as { id: string };
    const restaurantId = parseInt(id);

    if (isNaN(restaurantId)) {
      throw error(400, { message: 'Invalid restaurant ID' });
    }

    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (!restaurant) {
      throw error(404, { message: 'Restaurant not found' });
    }

    return {
      restaurant,
    };
  })
  .get('/:id/menu-items', async ({ params, error }) => {
    const { id } = params as { id: string };
    const restaurantId = parseInt(id);

    if (isNaN(restaurantId)) {
      throw error(400, { message: 'Invalid restaurant ID' });
    }

    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.restaurantId, restaurantId));

    return {
      menuItems: items,
    };
  });

