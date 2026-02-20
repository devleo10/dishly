import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { JWTPayload } from '../types';

export const authPlugin = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'your-secret-key',
    })
  )
  .post('/auth/register', async ({ body, jwt, error }) => {
    const { email, password } = body as {
      email: string;
      password: string;
    };
    const role = 'member';

    if (!email || !password) {
      throw error(400, { message: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw error(409, { message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        role,
      })
      .returning();

    // Generate JWT
    const token = await jwt.sign({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    } as JWTPayload);

    return {
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  })
  .post('/auth/login', async ({ body, jwt, error }) => {
    const { email, password } = body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      throw error(400, { message: 'Email and password are required' });
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw error(401, { message: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw error(401, { message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = await jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    } as JWTPayload);

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  })
  .get(
    '/auth/profile',
    async ({ jwt, headers, error }) => {
      const token = headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw error(401, { message: 'Unauthorized' });
      }

      const payload = await jwt.verify(token);

      if (!payload) {
        throw error(401, { message: 'Invalid token' });
      }

      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, payload.userId as number))
        .limit(1);

      if (!user) {
        throw error(404, { message: 'User not found' });
      }

      return {
        user,
      };
    },
    {
      beforeHandle: ({ headers, error }) => {
        if (!headers.authorization) {
          throw error(401, { message: 'Authorization header required' });
        }
      },
    }
  );





