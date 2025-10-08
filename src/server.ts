import 'reflect-metadata';
import 'dotenv/config';
import {ApolloServer} from 'apollo-server';
import {buildSchema} from 'type-graphql';
import ApartmentResolver from './apartment/apartment.resolver';
import connectDB from './connectDB';
import LeaseResolver from './lease/lease.resolver';
import PaymentResolver from './payment/payment.resolver';
import TenantResolver from './tenant/tenant.resolver';

const PORT = process.env.PORT || 3005;

(async () => {
  try {
    await connectDB();

    const schema = await buildSchema({
      resolvers: [ApartmentResolver, TenantResolver, LeaseResolver, PaymentResolver],
      validate: false,
    });

    const server = new ApolloServer({
      schema,
    });

    await server.listen({port: PORT});
    console.log('Server listening on port:', PORT);
  } catch (error) {
    console.log('ERROR', error);
  }
})();
