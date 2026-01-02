import { Elysia } from 'elysia';
import type { UserRole } from '../types';

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return new Elysia()
    .derive({ as: 'scoped' }, ({ jwt, headers, error }) => {
      return {
        async checkRole() {
          const token = headers.authorization?.replace('Bearer ', '');
          
          if (!token) {
            throw error(401, { message: 'Unauthorized' });
          }

          const payload = await jwt.verify(token);
          
          if (!payload) {
            throw error(401, { message: 'Invalid token' });
          }

          const userRole = payload.role as UserRole;
          
          if (!allowedRoles.includes(userRole)) {
            throw error(403, { message: 'Forbidden: Insufficient permissions' });
          }

          return payload;
        },
      };
    });
};


