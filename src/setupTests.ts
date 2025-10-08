import 'reflect-metadata';
import {DataSource} from 'typeorm';
import connectDB from './connectDB';

let db: DataSource;

beforeAll(async () => {
  db = await connectDB();
  await db.synchronize(true);
});

beforeEach(async () => {
  if (!db.isInitialized) {
    db = await connectDB();
  }
  await db.synchronize(true);
});

afterEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  if (db && db.isInitialized) {
    await db.synchronize(true);
    await db.destroy();
  }
});
