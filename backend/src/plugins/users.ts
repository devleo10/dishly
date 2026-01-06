import { Elysia } from 'elysia';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const usersPlugin = new Elysia({ prefix: '/users' })
  .get('/', async () => {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users);

    return {
      users: allUsers,
    };
  })
  .get('/:id', async ({ params, error }) => {
    const { id } = params as { id: string };
    const userId = parseInt(id);

    if (isNaN(userId)) {
      throw error(400, { message: 'Invalid user ID' });
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw error(404, { message: 'User not found' });
    }

    return {
      user,
    };
  });




