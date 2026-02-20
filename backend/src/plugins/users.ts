import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const usersPlugin = new Elysia({ prefix: '/users' })
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

    if (user.role !== 'admin') {
      throw error(403, { message: 'Only Admin can list all users' });
    }

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
  .get('/:id', async ({ params, getCurrentUser, error }) => {
    const user = await getCurrentUser();
    const { id } = params as { id: string };
    const userId = parseInt(id);

    if (isNaN(userId)) {
      throw error(400, { message: 'Invalid user ID' });
    }

    // Users can only view their own profile unless they are admin
    if (user.role !== 'admin' && user.userId !== userId) {
      throw error(403, { message: 'Forbidden' });
    }

    const [foundUser] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!foundUser) {
      throw error(404, { message: 'User not found' });
    }

    return {
      user: foundUser,
    };
  });
