import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { authPlugin } from './plugins/auth';
import { usersPlugin } from './plugins/users';
import { restaurantsPlugin } from './plugins/restaurants';
import { menuItemsPlugin } from './plugins/menu-items';
import { ordersPlugin } from './plugins/orders';
import { paymentMethodsPlugin } from './plugins/payment-methods';
import { checkoutPlugin } from './plugins/checkout';

const app = new Elysia()
  .use(cors())
  .use(authPlugin)
  .use(usersPlugin)
  .use(restaurantsPlugin)
  .use(menuItemsPlugin)
  .use(ordersPlugin)
  .use(paymentMethodsPlugin)
  .use(checkoutPlugin)
  .get('/', () => {
    return {
      message: 'Dishly API',
      version: '1.0.0',
    };
  })
  .listen(process.env.PORT || 3001);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);


