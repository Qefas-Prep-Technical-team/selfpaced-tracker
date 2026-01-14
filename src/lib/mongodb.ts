// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

const cache = global.mongooseCache || { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  console.log(MONGODB_URI);

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cache.conn = await cache.promise;
  global.mongooseCache = cache;

  return cache.conn;
}

export default dbConnect;
