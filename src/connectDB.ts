import * as TypeORM from 'typeorm';
import Apartment from './apartment/apartment.entity';
import Lease from './lease/lease.entity';
import Payment from './payment/payment.entity';
import Tenant from './tenant/tenant.entity';

const connectDB = async (): Promise<TypeORM.DataSource> =>
  new TypeORM.DataSource({
    type: 'sqlite',
    database: './db.sql',
    synchronize: true,
    entities: [Apartment, Tenant, Lease, Payment],
  }).initialize();

export default connectDB;
